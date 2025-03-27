/**
 * Despliega el contrato Multiplier en la red
 * @returns {Promise<void>}
 */
async function main() {
    const Multiplier2 = await ethers.getContractFactory("Multiplier2");
    const multiplier = await Multiplier2.deploy();
    await multiplier.waitForDeployment();
    console.log("Contrato desplegado en:", await multiplier.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });