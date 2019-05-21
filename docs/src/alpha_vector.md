# Alpha Vector Policy

Represents a policy with a set of alpha vectors. Can be constructed with [`AlphaVectorPolicy(pomdp, alphas, action_map)`](@ref), where alphas is either a vector of vectors or an |S| x (number of alpha vectors) matrix. The `action_map` argument is a vector of actions with length equal to the number of alpha vectors. If this argument is not provided, ordered_actions is used to generate a default action map.

Determining the estimated value and optimal action depends on calculating the dot product between alpha vectors and a belief vector. [`POMDPPolicies.beliefvec(pomdp, b)`](@ref) is used to create this vector and can be overridden for new belief types for efficiency.

```@docs
AlphaVectorPolicy
POMDPPolicies.beliefvec
``` 
