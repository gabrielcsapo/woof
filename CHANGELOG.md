# 0.2.1 (01/09/2018)

- if the version is set, don't try to print the version in the parent directory

# 0.2.0 (01/04/2018)

- augments command and flag objects into hashmaps for faster lookup than array traversal
- condenses help and version logic by also making lookup via hashmap

# 0.1.0 (12/15/2017)

- adds additional tests
- can override version by passing it as `option.version`
- help and version are set when they are parsed out (instead of calling process.exit)

# 0.0.1 (12/13/2017)

- basic functionality working!
