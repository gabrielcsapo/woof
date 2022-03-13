# 0.4.1 (03/13/2022)

- use `module.parent.filename` when possible, do not fail in esm

# 0.4.0 (3/31/2019)

- adds list option that will allow you to define a list type

# 0.3.2 (11/07/2018)

- adds option for default command
- cleans up variable declarations

# 0.3.1 (02/21/2018)

- can now handle arguments formatted like `{key}={value}` in any form such as:
  - `-{shorthand}={value}`
  - `--{shorthand}={value}`
  - `--{key}={value}`
  - `-{key}={value}`
  - `{key}={value}`
- internal mechanism for dealing with arguments has been switched from a access loop, to a stack based approach to retrieving values

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
