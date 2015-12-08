# Services

Jarvis has no functionality of his own (spare for the "core functionality" mentioned in the read-me). Instead, there will be self-registering services that communicate via a combination of UDP and TCP.

### UDP's role
UDP will be for service discovery, and heartbeat / status.

### TCP's role
From there, TCP will handle all other data communications. A service needs to specify what it can **do**, which can be done by providing a list of verbs and required / optional kinds of objects.

## Security
I'm unsure what security threats will be open, but I think a good standard would be to always use TLS where available.
> Hide your trees in forests.

## Service description
These objects and verbs need to be as broad as possible. For example "Feed" should take an object of kind "animal" so that it can cover pets, children, adults, guests, etc. Generic verbs are best but need a degree of specificity, so that aliases can be more connected to the service. For example "murder" is preferred over "terminate" because "terminate" could mean many different things however "murder" is specific enough and can be more closely associated to less formal words with the same meanings (ie: assassinate).

> It should be pointed out that this is essentially a more generic version for Android's "intents" and is intended to be done without any visual confirmation. There will be a default application stack that falls back until a method is successful.
