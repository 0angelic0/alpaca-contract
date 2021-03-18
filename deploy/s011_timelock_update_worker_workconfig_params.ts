import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { IWorker__factory, IStrategy__factory, Timelock__factory } from '../typechain'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
  Check all variables below before execute the deployment script
  */

  const WORKER_CONFIG_ADDR = '0xAB5AD8e7248C9b28e114723E8A43FbB0bFa98483';

  const UPDATES = [{
    WORKER_ADDRESS: '0xc2440b08478ce53351176d37FD63724f57961197',
    WORK_FACTOR: '6000',
    KILL_FACTOR: '8000',
    MAX_PRICE_DIFF: '1300',
  }, {
    WORKER_ADDRESS: '0x6Ac6619BbA455BD247776f4BbE767Fb516E19D18',
    WORK_FACTOR: '6667',
    KILL_FACTOR: '8333',
    MAX_PRICE_DIFF: '1300',
  }, {
    WORKER_ADDRESS: '0xe7aa7b1c8317203cb5b52a7002DFF489a7086157',
    WORK_FACTOR: '6667',
    KILL_FACTOR: '8333',
    MAX_PRICE_DIFF: '1300',
  }, {
    WORKER_ADDRESS: '0x0d0875fce644De95c2ae7f0E4D4596b2A8dC43e3',
    WORK_FACTOR: '8333',
    KILL_FACTOR: '9000',
    MAX_PRICE_DIFF: '1300',
  }, {
    WORKER_ADDRESS: '0xF3ECC0e5c238C7082fC59e682104DEA2f49A3787',
    WORK_FACTOR: '6667',
    KILL_FACTOR: '8333',
    MAX_PRICE_DIFF: '1300',
  }]

  const TIMELOCK = '0x771F70042ebb6d2Cfc29b7BF9f3caf9F959385B8';
  const EXACT_ETA = '1616075700';











  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  for(let i = 0; i < UPDATES.length; i++) {
    console.log(">> Timelock: Setting WorkerConfig via Timelock");
    await timelock.queueTransaction(
      WORKER_CONFIG_ADDR, '0',
      'setConfigs(address[],(bool,uint64,uint64,uint64)[])',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],
        [
          [UPDATES[i].WORKER_ADDRESS], [{acceptDebt: true, workFactor: UPDATES[i].WORK_FACTOR, killFactor: UPDATES[i].KILL_FACTOR, maxPriceDiff: UPDATES[i].MAX_PRICE_DIFF}]
        ]
      ), EXACT_ETA
    );
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${WORKER_CONFIG_ADDR}', '0', 'setConfigs(address[],(bool,uint64,uint64,uint64)[])', ethers.utils.defaultAbiCoder.encode(['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],[['${UPDATES[i].WORKER_ADDRESS}'], [{acceptDebt: true, workFactor: ${UPDATES[i].WORK_FACTOR}, killFactor: ${UPDATES[i].KILL_FACTOR}, maxPriceDiff: ${UPDATES[i].MAX_PRICE_DIFF}}]]), ${EXACT_ETA})`)
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['TimelockUpdateWorkerWorkerConfigParams'];