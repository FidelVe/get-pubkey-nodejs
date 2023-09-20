# get-pubkey-nodejs

nodejs script showcasing how to recover a public key with a given transaction hash and transaction signature.

To use this script is necessary to create a `.env` file with the following format defining a valid private key, signature and transaction hash:
```
# private key format in hex without 0x prefix
PRIVATE_KEY="0...e03"
# signature format in base64
SIGNATURE="HcqD4K.....sBbAA="
# transaction hash format in hex without 0x prefix
TX_HASH="eb4e5.....b8575"
