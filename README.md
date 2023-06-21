# Uniswap V3 Staker Subgraph
## Note
This repo is archived. New [github repository](https://github.com/msvstj/v3-subgraph/tree/staking-only) is used for staking data.

## About
Fork of [vbstreetz](https://github.com/vbstreetz/uniswap-v3-staker-subgraph) staker subgraph repository. <br>
Purpose: handling Uniswap V3 staking events and displaying staking data in DAPPS.

## Changes
Main differences from the forked repository:
<br>
![img](https://gateway.pinata.cloud/ipfs/QmeerkwfgCLQW1bqkot34QEQhja2SZGRJKtAdQhmvGuXXL/)

- **Network:** switched to mumbai/goerli testnets.
- **Schema update:** 
    - **Positions**: (mapped using Position view. Mapping logic referenced from: [Uniswap V3](https://github.com/Uniswap/v3-subgraph/blob/main/src/mappings/position-manager.ts) and applied in [nft-positions-manager-mapping.ts](./src/nft-positions-manager-mapping.ts)). 
    <br> Added fields:
        - token0 
        - token1
        - fee
    - **Incentives**: added array to the positions schema. *(There can be more than 1 incentive per position)*.


### TODO:
- Handle unstaked (but not withdrawn) tokens.

## Deployment
1. Install packages 
2. Update `package.json` to:
    - Match the created subgraphs;
    - Edit `deploy:<<network>>` command with access keys and created subgraph name.
3. Update `Makefile` to match the created subgraphs.
3. Deploy e.g. to polygon testnet with `make mumbai`
4. Visit the subgraphs and verify no errors in indexing.

## References
- [vbstreetz](https://github.com/vbstreetz/uniswap-v3-staker-subgraph)
- [Uniswap V3](https://github.com/Uniswap/v3-subgraph/blob/main/src/mappings/position-manager.ts)

## License
MIT
