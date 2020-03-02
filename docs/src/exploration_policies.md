# Exploration Policies 

Exploration policies are often useful for Reinforcement Learning algorithm to choose an action that is different than the action given by the policy being learned. 

This package provides two exploration policies: `EpsGreedyPolicy` and `SoftmaxPolicy`

```@docs 
    EpsGreedyPolicy
    SoftmaxPolicy
```

## Interface 

Exploration policies are subtype of the abstract `ExplorationPolicy` type and they follow the following interface: 
`action(exploration_policy::ExplorationPolicy, on_policy::Policy, s)`.

The `action` method is exported by [POMDPs.jl](https://github.com/JuliaPOMDP/POMDPs.jl). 
To use exploration policies in a solver, you must use the three argument version of `action` where `on_policy` is the policy being learned (e.g. tabular policy or neural network policy).

## Schedules 

Exploration policies often relies on a key parameter: $\epsilon$ in $\epsilon$-greedy and the temperature in softmax for example. 
Reinforcement learning algorithms often require a decay schedule for these parameters. 
`POMDPPolicies.jl` exports an interface for implementing decay schedules as well as a few convenient schedule. 

```@docs 
    LinearDecaySchedule 
    ConstantSchedule
```

To implement your own schedule, you must define a schedule type that is a subtype of `ExplorationSchedule`, as well as the function `update_value` that returns the new parameter value updated according to your schedule.

```@docs 
    ExplorationSchedule
    update_value
```
