import { ethereum, crypto } from '@graphprotocol/graph-ts';
import {
  DepositTransferred,
  IncentiveCreated,
  IncentiveEnded,
  RewardClaimed,
  TokenStaked,
  TokenUnstaked,
} from '../generated/UniV3Staker/UniV3Staker';
import { Incentive, Position } from '../generated/schema';

export function handleIncentiveCreated(event: IncentiveCreated): void {
  let incentiveIdTuple: Array<ethereum.Value> = [
    ethereum.Value.fromAddress(event.params.rewardToken),
    ethereum.Value.fromAddress(event.params.pool),
    ethereum.Value.fromUnsignedBigInt(event.params.startTime),
    ethereum.Value.fromUnsignedBigInt(event.params.endTime),
    ethereum.Value.fromAddress(event.params.refundee),
  ];
  let incentiveIdEncoded = ethereum.encode(
    ethereum.Value.fromTuple(changetype<ethereum.Tuple>(incentiveIdTuple))
  )!;
  let incentiveId = crypto.keccak256(incentiveIdEncoded);

  let entity = Incentive.load(incentiveId.toHex());
  if (entity == null) {
    entity = new Incentive(incentiveId.toHex());
  }

  entity.rewardToken = event.params.rewardToken;
  entity.pool = event.params.pool;
  entity.startTime = event.params.startTime;
  entity.endTime = event.params.endTime;
  entity.refundee = event.params.refundee;
  entity.reward = event.params.reward;
  entity.ended = false;

  entity.save();
}

export function handleIncentiveEnded(event: IncentiveEnded): void {
  let entity = Incentive.load(event.params.incentiveId.toHex());
  if (entity != null) {
    entity.ended = true;
    entity.save();
  }
}

export function handleRewardClaimed(event: RewardClaimed): void {}

//Adding incentive to the array.
export function handleTokenStaked(event: TokenStaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.staked = true;
    entity.liquidity = event.params.liquidity;

    if(entity.stakedIncentives != null){
        let stakedIncentivesArray = entity.stakedIncentives;
        stakedIncentivesArray.push(event.params.incentiveId);
        entity.stakedIncentives = stakedIncentivesArray;
    }else{
        entity.stakedIncentives = [event.params.incentiveId]
    }
    entity.save();
  }

}
//Removing incentive from the array.
export function handleTokenUnstaked(event: TokenUnstaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.staked = false;

    if(entity.stakedIncentives != null){
      let stakedIncentivesArray = entity.stakedIncentives;
      let index = stakedIncentivesArray.indexOf(event.params.incentiveId);

      if(index !== -1){
        stakedIncentivesArray.splice(index, 1);
      }

      entity.stakedIncentives = stakedIncentivesArray;
    }
    entity.save();
  }
}

export function handleDepositTransferred(event: DepositTransferred): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.oldOwner = event.params.oldOwner;
    entity.owner = event.params.newOwner;
    entity.save();
  }
}

