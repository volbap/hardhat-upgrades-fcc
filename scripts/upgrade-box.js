const {
    getTransparentUpgradeableProxyFactory,
} = require("@openzeppelin/hardhat-upgrades/dist/utils")

const { ethers, upgrades } = require("hardhat")

async function main() {
    // Upgrading Box -> BoxV2

    // A. Manual way
    const admin = await ethers.getContract("BoxProxyAdmin")
    const proxy = await ethers.getContract("Box_Proxy")
    const boxV2 = await ethers.getContract("BoxV2")

    const proxyBoxV1 = await ethers.getContractAt("Box", proxy.address)
    const version1 = await proxyBoxV1.version()
    console.log(`Box version is ${version1.toString()}`)

    const upgradeTx = await admin.upgrade(proxy.address, boxV2.address)
    await upgradeTx.wait(1)

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", proxy.address)
    const version2 = await proxyBoxV2.version()
    console.log(`Box version is ${version2.toString()}`)

    // B. hh deploy built-in
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
