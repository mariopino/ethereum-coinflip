![Screenshot](https://raw.githubusercontent.com/mariopino/ethereum-coinflip/master/screenshot.png)

# Ethereum coin flip game

Coin Flip Ethereum DApp, a simple casino game based on Ethereum blockchain. Includes Ethereum Smart Contract written in Solidity language (CoinFlip.sol) and a bootstrap 4 / web3.js based web interface to interact with it.

## Demo

http://coinflip.quequiereshacer.es/

## The game

Game is simple, you bet an ether amount and the coin flips, if the coin goes head you'll earn the 190% of your bet. If the coin goes tails you'll loose your bet.

## How to play

You must install [Metamask](https://metamask.io/) in your browser in order to play the game. Currently we are testing in [Rinkeby ethereum test network](https://rinkeby.etherscan.io/), so be sure to select it when setup Metamask.

## No funds to play?

This DApp is running in Rinkeby Ethereum testnet. So you can just create a Rinkeby account in Metamask, go to [faucet.rinkeby.io](faucet.rinkeby.io) and follow the instructions to get free ethers from the thin air and play the game! ;-)

## How it works

Currently, we use the current block timestamp to simulate the coin flip. Odd timestamp equals to Heads and even timestamp equals to Tails. If the timestamp of your transaction is an odd number, you'll get the 190% of your bet, in the other case, if the timestamp is even you lose your bet.

## Install

To run your own ethereum coin flip instance:

1. Publish the solidity smart contract using Ethereum Wallet / Mist or use your favorite method and take note of the contract address. You must deposit funds to the contract, either at publish time or using the contract function depositFunds(). This is required because contract must have funds to pay the prize if the firsts clients win.

2. Edit js/coinflip.js and in the header replace the address of the contract.

3. Upload DApp files to a webserver, a static files web server is enought. You can also run it in local filesystem if you want.

4. Play!

## TODO

### UI:

* Implement DataTables (https://datatables.net) in Last Played Games.
* Implement tabs, rename 'Last Played Games' to 'Last 10 Bets' and implement 'Wins' table.
* Rewrite UpdateGamesTable() function to manage all table updates.
* Change loading spinner, provide better gaming experience.
* New website sections.
* Try to explain the game better in jumbotron.


### Smart Contract:

* Test new maximum bet variable.
* If a user send more than the maximum bet, play the max bet and return the rest to the user.
* Try this random number generator function that doesn't need an oracle to do their job: https://gist.github.com/alexvandesande/259b4ffb581493ec0a1c
* Implement Oraclize
