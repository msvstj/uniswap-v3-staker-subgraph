import {
  Approval,
  ApprovalForAll,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  Transfer,
  NFTPositionsManager
} from '../generated/NFTPositionsManager/NFTPositionsManager';
import { Position } from '../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts'

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity == null) {
    let contract = NFTPositionsManager.bind(event.address)

    //Adding token0, token1 and fee to Position Schema. Referenced from Uniswap V3 Subgraph repository.
    let positionViewData = contract.try_positions(event.params.tokenId)
       
    entity = new Position(event.params.tokenId.toHex());
    entity.approved = null;

    if (!positionViewData.reverted) {
      let positionResult = positionViewData.value;
      entity.token0 = positionResult.value2;
      entity.token1 = positionResult.value3;
      entity.fee = BigInt.fromI32(positionResult.value4);
    }

    entity.tokenId = event.params.tokenId;
    entity.owner = event.transaction.from;
    entity.staked = false;
    entity.oldOwner = null;
  }
  entity.liquidity = event.params.liquidity;
  entity.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.liquidity = event.params.liquidity;
    entity.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.oldOwner = event.params.from;
    entity.owner = event.params.to;
    entity.approved = null;
    entity.save();
  }
}

export function handleApproval(event: Approval): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.approved = event.params.approved;
    entity.save();
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCollect(event: Collect): void {}
