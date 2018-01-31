# 0.3.0 (01/31/2018)

- adds a validate parameter on flags that will let the developer validate content while its being parsed. If there is an error with the parsing it will set the error object on the output.
- adds tests for integer parsing flags

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
