# POMDPPolicies

[![Build Status](https://travis-ci.org/JuliaPOMDP/POMDPPolicies.jl.svg?branch=master)](https://travis-ci.org/JuliaPOMDP/POMDPPolicies.jl)
[![Coverage Status](https://coveralls.io/repos/github/JuliaPOMDP/POMDPPolicies.jl/badge.svg?branch=master)](https://coveralls.io/github/JuliaPOMDP/POMDPPolicies.jl?branch=master)

Utility policy types for POMDPs.jl

# Alpha Vector

Represents a policy with a set of alpha vectors. Can be constructed with AlphaVectorPolicy(pomdp, alphas, action_map), where alphas is either a vector of vectors or an |S| x |A| matrix. The action_map argument is a vector of actions with length equal to the number of alpha vectors. If this argument is not provided, ordered_actions is used to generate a default action map.
function.jl

Turns a function into a Policy object, i.e. when action is called on FunctionPolicy(s->1), it will always return 1 as the action.

# Random

A policy that returns a randomly selected action using rand(rng, actions(pomdp)).

# Stochastic

A more flexible set of randomized policies including the following:

    StochasticPolicy samples actions from an arbitrary distribution.
    EpsGreedy uses epsilon-greedy action selection.

# Vector

Tabular policies including the following:

    VectorPolicy holds a vector of actions, one for each state, ordered according to state_index.
    ValuePolicy holds a matrix of values for state-action pairs and chooses the action with the highest value at the given state

# Utility Wrapper

A wrapper for policies to collect statistics and handle errors.

    PolicyWrapper

Flexible utility wrapper for a policy designed for collecting statistics about planning.

Carries a function, a policy, and optionally a payload (that can be any type).

The function should typically be defined with the do syntax. Each time `action` is called on the wrapper, this function will be called.

If there is no payload, it will be called with two argments: the policy and the state/belief. If there is a payload, it will be called with three arguments: the policy, the payload, and the current state or belief. The function should return an appropriate action. The idea is that, in this function, `action(policy, s)` should be called, statistics from the policy/planner should be collected and saved in the payload, exceptions can be handled, and the action should be returned.

## Example

    using POMDPModels
    using POMDPPolicies

    mdp = GridWorld()
    policy = RandomPolicy(mdp)
    counts = Dict(a=>0 for a in iterator(actions(mdp)))

    # with a payload
    statswrapper = PolicyWrapper(policy, payload=counts) do policy, counts, s
        a = action(policy, s)
        counts[a] += 1
        return a
    end

    h = simulate(HistoryRecorder(max_steps=100), mdp, statswrapper)
    for (a, count) in payload(statswrapper)
        println("policy chose action \$a \$count of \$(n_steps(h)) times.")
    end

    # without a payload
    errwrapper = PolicyWrapper(policy) do policy, s
        try
            a = action(policy, s)
        catch ex
            warn("Caught error in policy; using default")
            a = :left
        end
        return a
    end

    h = simulate(HistoryRecorder(max_steps=100), mdp, errwrapper)

