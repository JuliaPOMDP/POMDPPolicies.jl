# Alpha Vector Policy

Represents a policy with a set of alpha vectors. Can be constructed with `AlphaVectorPolicy(pomdp, alphas, action_map)`, where alphas is either a vector of vectors or an |S| x |A| matrix. The `action_map` argument is a vector of actions with length equal to the number of alpha vectors. If this argument is not provided, ordered_actions is used to generate a default action map.

```@docs
AlphaVectorPolicy
``` 
