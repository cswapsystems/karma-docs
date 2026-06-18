---
title: "Wallet Verification"
sidebar_position: 2
---

BTC Karma uses wallet verification to connect Bitcoin staking activity with a verified reward identity.

The goal is to verify ownership and authorization without asking users to share private keys or seed phrases.

## Bitcoin Wallet Verification

Users may be asked to sign a message with their Bitcoin wallet.

This signature helps prove that the user controls the Bitcoin wallet associated with the staking position.

## Cardano Reward Verification

Users may also be asked to verify a Cardano wallet or reward address.

This allows BTC Karma to associate Bitcoin staking activity with a verified reward destination.

## Challenge-Based Authorization

BTC Karma may use nonce-bound challenge authorization.

A nonce is a unique value used for a specific authorization request. This helps prevent old signatures from being reused maliciously.

## Replay Protection

Replay protection is designed to prevent a valid signature or authorization from being reused in the wrong context.

This is important for keeping wallet verification and reward routing secure.

## User Safety

BTC Karma will never ask for your seed phrase or private key.

Only sign wallet messages when you understand the action and are on the official BTC Karma website.
