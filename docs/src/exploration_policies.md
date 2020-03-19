# Exploration Policies 

Exploration policies are often useful for Reinforcement Learning algorithm to choose an action that is different than the action given by the policy being learned (`on_policy`). 

Exploration policies are subtype of the abstract `ExplorationPolicy` type and they follow the following interface: 
`action(exploration_policy::ExplorationPolicy, on_policy::Policy, k, s)`. `k` is used to compute the value of the exploration parameter (see [Schedule](@ref)), and `s` is the current state or observation in which the agent is taking an action.

The `action` method is exported by [POMDPs.jl](https://github.com/JuliaPOMDP/POMDPs.jl). 
To use exploration policies in a solver, you must use the four argument version of `action` where `on_policy` is the policy being learned (e.g. tabular policy or neural network policy).

This package provides two exploration policies: `EpsGreedyPolicy` and `SoftmaxPolicy`

```@docs 
    EpsGreedyPolicy
    SoftmaxPolicy
```

## Schedule

Exploration policies often rely on a key parameter: $\epsilon$ in $\epsilon$-greedy and the temperature in softmax for example. 
Reinforcement learning algorithms often require a decay schedule for these parameters. 
Schedule can be passed to an exploration policy as functions. For example one can define an epsilon greedy policy with an exponential decay schedule as follow: 
```julia 
    m # your mdp or pomdp model
    exploration_policy = EpsGreedyPolicy(m, k->0.05*0.9^(k/10))
```

`POMDPPolicies.jl` exports a linear decay schedule object that can be used as well.  

```@docs 
    LinearDecaySchedule 
```
