# security overview

BTC Karma is designed to create a safer and cleaner Bitcoin staking experience by using wallet verification, account-level reward tracking, and cryptographic authorization.

## Security Goals

BTC Karma is designed around several core security goals:

* Verify Bitcoin wallet ownership
* Verify Cardano reward destinations
* Prevent replay attacks
* Bind user actions to specific authorization challenges
* Reduce fragmented reward accounting
* Create cleaner tracking for users and institutions

## Wallet Verification

Users may be asked to sign messages with their wallets to prove ownership.

This allows BTC Karma to verify that a user controls the wallet associated with a staking position.

## Reward Destination Verification

BTC Karma may require users to verify their reward destination.

This helps ensure rewards are connected to the correct account and reduces the risk of incorrect or unauthorized reward routing.

## Account-Level Tracking

BTC Karma is designed to consolidate user staking activity into a cleaner account-level reward system.

This makes reward tracking simpler for users and more suitable for larger participants, including institutions, custodians, and Bitcoin-focused capital allocators.

## Technical Security Components

BTC Karma's security model may include:

* BIP-322 Bitcoin message signing
* CIP-8 Cardano message signing
* Nonce-bound challenge authorization
* Replay protection
* Verified reward destination binding
* OP\_RETURN validation
* Stake key verification

These mechanisms are intended to prove wallet ownership, bind actions to authorized users, and reduce the chance of incorrect reward routing.

## Important User Safety Notes

Users should always:

* Confirm they are on the official BTC Karma website
* Never share seed phrases or private keys
* Review wallet prompts carefully
* Understand what they are signing
* Avoid unofficial links, fake support accounts, and impersonators

BTC Karma will never ask users for seed phrases or private keys.
