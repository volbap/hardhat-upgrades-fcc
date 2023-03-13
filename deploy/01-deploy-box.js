const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")

const { network } = require("hardhat")
const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    console.log("Deploying Box...")
    const args = []

    const box = await deploy("Box", {
        from: deployer,
        args: args,
        waitConfirmations: waitBlockConfirmations,
        log: true,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            // the admin of the proxy won't be a wallet but a contract (BoxProxyAdmin)
            // this is a good practice
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(box.address, args)
    }
}
