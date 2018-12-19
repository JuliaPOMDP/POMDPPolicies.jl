var documenterSearchIndex = {"docs": [

{
    "location": "alpha_vector.html#",
    "page": "Alpha Vector Policy",
    "title": "Alpha Vector Policy",
    "category": "page",
    "text": ""
},

{
    "location": "alpha_vector.html#POMDPPolicies.AlphaVectorPolicy",
    "page": "Alpha Vector Policy",
    "title": "POMDPPolicies.AlphaVectorPolicy",
    "category": "type",
    "text": "AlphaVectorPolicy{P<:POMDP, A}\n\nRepresents a policy with a set of alpha vectors \n\nConstructor: \n\n`AlphaVectorPolicy(pomdp::POMDP, alphas)`\n\nalphas can be a matrix or a vector of vectors\n\nFields\n\npomdp::P the POMDP problem \nalphas::Vector{Vector{Float64}} the list of alpha vectors\naction_map::Vector{A} a list of action corresponding to the alpha vectors\n\n\n\n\n\n"
},

{
    "location": "alpha_vector.html#POMDPPolicies.beliefvec",
    "page": "Alpha Vector Policy",
    "title": "POMDPPolicies.beliefvec",
    "category": "function",
    "text": "POMDPPolicies.beliefvec(m::POMDP, b)\n\nReturn a vector-like representation of the belief b suitable for calculating the dot product with the alpha vectors.\n\n\n\n\n\n"
},

{
    "location": "alpha_vector.html#Alpha-Vector-Policy-1",
    "page": "Alpha Vector Policy",
    "title": "Alpha Vector Policy",
    "category": "section",
    "text": "Represents a policy with a set of alpha vectors. Can be constructed with AlphaVectorPolicy(pomdp, alphas, action_map), where alphas is either a vector of vectors or an |S| x (number of alpha vectors) matrix. The action_map argument is a vector of actions with length equal to the number of alpha vectors. If this argument is not provided, ordered_actions is used to generate a default action map.Determining the estimated value and optimal action depends on calculating the dot product between alpha vectors and a belief vector. POMDPPolicies.beliefvec(pomdp, b) is used to create this vector and can be overridden for new belief types for efficiency.AlphaVectorPolicy\nPOMDPPolicies.beliefvec"
},

{
    "location": "function.html#",
    "page": "Function",
    "title": "Function",
    "category": "page",
    "text": ""
},

{
    "location": "function.html#POMDPPolicies.FunctionPolicy",
    "page": "Function",
    "title": "POMDPPolicies.FunctionPolicy",
    "category": "type",
    "text": "FunctionPolicy\n\nPolicy p=FunctionPolicy(f) returns f(x) when action(p, x) is called.\n\n\n\n\n\n"
},

{
    "location": "function.html#POMDPPolicies.FunctionSolver",
    "page": "Function",
    "title": "POMDPPolicies.FunctionSolver",
    "category": "type",
    "text": "FunctionSolver\n\nSolver for a FunctionPolicy.\n\n\n\n\n\n"
},

{
    "location": "function.html#Function-1",
    "page": "Function",
    "title": "Function",
    "category": "section",
    "text": "A policy represented by a function. FunctionPolicyFunctionSolver"
},

{
    "location": "index.html#",
    "page": "About",
    "title": "About",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#About-1",
    "page": "About",
    "title": "About",
    "category": "section",
    "text": "POMDPPolicies provides a collection of policy types for POMDPs.jl.It currently provides:an alpha vector policy type\na random policy\na stochastic policy type\na vector policy type\na wrapper to collect statistics and errors about policies"
},

{
    "location": "random.html#",
    "page": "Random Policy",
    "title": "Random Policy",
    "category": "page",
    "text": ""
},

{
    "location": "random.html#POMDPPolicies.RandomPolicy",
    "page": "Random Policy",
    "title": "POMDPPolicies.RandomPolicy",
    "category": "type",
    "text": "RandomPolicy{RNG<:AbstractRNG, P<:Union{POMDP,MDP}, U<:Updater}\n\na generic policy that uses the actions function to create a list of actions and then randomly samples an action from it.\n\nConstructor:\n\n`RandomPolicy(problem::Union{POMDP,MDP};\n         rng=Random.GLOBAL_RNG,\n         updater=NothingUpdater())`\n\nFields\n\nrng::RNG a random number generator \nprobelm::P the POMDP or MDP problem \nupdater::U a belief updater (default to NothingUpdater in the above constructor)\n\n\n\n\n\n"
},

{
    "location": "random.html#POMDPPolicies.RandomSolver",
    "page": "Random Policy",
    "title": "POMDPPolicies.RandomSolver",
    "category": "type",
    "text": "solver that produces a random policy\n\n\n\n\n\n"
},

{
    "location": "random.html#Random-Policy-1",
    "page": "Random Policy",
    "title": "Random Policy",
    "category": "section",
    "text": "A policy that returns a randomly selected action using rand(rng, actions(pomdp)).RandomPolicyRandomSolver"
},

{
    "location": "stochastic.html#",
    "page": "Stochastic Policies",
    "title": "Stochastic Policies",
    "category": "page",
    "text": ""
},

{
    "location": "stochastic.html#POMDPPolicies.StochasticPolicy",
    "page": "Stochastic Policies",
    "title": "POMDPPolicies.StochasticPolicy",
    "category": "type",
    "text": "StochasticPolicy{D, RNG <: AbstractRNG}\n\nRepresents a stochastic policy. Action are sampled from an arbitrary distribution.\n\nConstructor:\n\n`StochasticPolicy(distribution; rng=Random.GLOBAL_RNG)`\n\nFields\n\ndistribution::D\nrng::RNG a random number generator\n\n\n\n\n\n"
},

{
    "location": "stochastic.html#POMDPPolicies.CategoricalTabularPolicy",
    "page": "Stochastic Policies",
    "title": "POMDPPolicies.CategoricalTabularPolicy",
    "category": "type",
    "text": "CategoricalTabularPolicy\n\nrepresents a stochastic policy sampling an action from a categorical distribution with weights given by a ValuePolicy\n\nconstructor:\n\nCategoricalTabularPolicy(mdp::Union{POMDP,MDP}; rng=Random.GLOBAL_RNG)\n\nFields\n\nstochastic::StochasticPolicy\nvalue::ValuePolicy\n\n\n\n\n\n"
},

{
    "location": "stochastic.html#POMDPPolicies.EpsGreedyPolicy",
    "page": "Stochastic Policies",
    "title": "POMDPPolicies.EpsGreedyPolicy",
    "category": "type",
    "text": "EpsGreedyPolicy\n\nrepresents an epsilon greedy policy, sampling a random action with a probability eps or sampling from a given stochastic policy otherwise.\n\nconstructor:\n\nEpsGreedyPolicy(mdp::Union{MDP,POMDP}, eps::Float64; rng=Random.GLOBAL_RNG)\n\n\n\n\n\n"
},

{
    "location": "stochastic.html#Stochastic-Policies-1",
    "page": "Stochastic Policies",
    "title": "Stochastic Policies",
    "category": "section",
    "text": "Types for representing randomized policies:StochasticPolicy samples actions from an arbitrary distribution.\nUniformRandomPolicy samples actions uniformly (see RandomPolicy for a similar use)\nCategoricalTabularPolicy samples actions from a categorical distribution with weights given by a ValuePolicy.\nEpsGreedyPolicy uses epsilon-greedy action selection.StochasticPolicyCategoricalTabularPolicyEpsGreedyPolicy"
},

{
    "location": "utility_wrapper.html#",
    "page": "Utility Wrapper",
    "title": "Utility Wrapper",
    "category": "page",
    "text": ""
},

{
    "location": "utility_wrapper.html#POMDPPolicies.PolicyWrapper",
    "page": "Utility Wrapper",
    "title": "POMDPPolicies.PolicyWrapper",
    "category": "type",
    "text": "PolicyWrapper\n\nFlexible utility wrapper for a policy designed for collecting statistics about planning.\n\nCarries a function, a policy, and optionally a payload (that can be any type).\n\nThe function should typically be defined with the do syntax. Each time action is called on the wrapper, this function will be called.\n\nIf there is no payload, it will be called with two argments: the policy and the state/belief. If there is a payload, it will be called with three arguments: the policy, the payload, and the current state or belief. The function should return an appropriate action. The idea is that, in this function, action(policy, s) should be called, statistics from the policy/planner should be collected and saved in the payload, exceptions can be handled, and the action should be returned.\n\nConstructor\n\nPolicyWrapper(policy::Policy; payload=nothing)\n\nExample\n\nusing POMDPModels\nusing POMDPToolbox\n\nmdp = GridWorld()\npolicy = RandomPolicy(mdp)\ncounts = Dict(a=>0 for a in actions(mdp))\n\n# with a payload\nstatswrapper = PolicyWrapper(policy, payload=counts) do policy, counts, s\n    a = action(policy, s)\n    counts[a] += 1\n    return a\nend\n\nh = simulate(HistoryRecorder(max_steps=100), mdp, statswrapper)\nfor (a, count) in payload(statswrapper)\n    println(\"policy chose action $a $count of $(n_steps(h)) times.\")\nend\n\n# without a payload\nerrwrapper = PolicyWrapper(policy) do policy, s\n    try\n        a = action(policy, s)\n    catch ex\n        @warn(\"Caught error in policy; using default\")\n        a = :left\n    end\n    return a\nend\n\nh = simulate(HistoryRecorder(max_steps=100), mdp, errwrapper)\n\nFields\n\nf::F\npolicy::P\npayload::PL\n\n\n\n\n\n"
},

{
    "location": "utility_wrapper.html#Utility-Wrapper-1",
    "page": "Utility Wrapper",
    "title": "Utility Wrapper",
    "category": "section",
    "text": "A wrapper for policies to collect statistics and handle errors.PolicyWrapper"
},

{
    "location": "vector.html#",
    "page": "Vector Policy",
    "title": "Vector Policy",
    "category": "page",
    "text": ""
},

{
    "location": "vector.html#POMDPPolicies.VectorPolicy",
    "page": "Vector Policy",
    "title": "POMDPPolicies.VectorPolicy",
    "category": "type",
    "text": "VectorPolicy{S,A}\n\nA generic MDP policy that consists of a vector of actions. The entry at stateindex(mdp, s) is the action that will be taken in state s.\n\nFields\n\nmdp::MDP{S,A} the MDP problem\nact::Vector{A} a vector of size |S| mapping state indices to actions\n\n\n\n\n\n"
},

{
    "location": "vector.html#POMDPPolicies.VectorSolver",
    "page": "Vector Policy",
    "title": "POMDPPolicies.VectorSolver",
    "category": "type",
    "text": "VectorSolver{A}\n\nSolver for VectorPolicy. Doesn\'t do any computation - just sets the action vector.\n\nFields\n\nact::Vector{A} the action vector\n\n\n\n\n\n"
},

{
    "location": "vector.html#POMDPPolicies.ValuePolicy",
    "page": "Vector Policy",
    "title": "POMDPPolicies.ValuePolicy",
    "category": "type",
    "text": " ValuePolicy{P<:Union{POMDP,MDP}, T<:AbstractMatrix{Float64}, A}\n\nA generic MDP policy that consists of a value table. The entry at stateindex(mdp, s) is the action that will be taken in state s. It is expected that the order of the actions in the value table is consistent with the order of the actions in act.  If act is not explicitly set in the construction, act is ordered according to actionindex.\n\nFields\n\nmdp::P the MDP problem\nvalue_table::T the value table as a |S|x|A| matrix\nact::Vector{A} the possible actions\n\n\n\n\n\n"
},

{
    "location": "vector.html#Vector-Policy-1",
    "page": "Vector Policy",
    "title": "Vector Policy",
    "category": "section",
    "text": "Tabular policies including the following:VectorPolicy holds a vector of actions, one for each state, ordered according to state_index.\nValuePolicy holds a matrix of values for state-action pairs and chooses the action with the highest value at the given stateVectorPolicy VectorSolverValuePolicy"
},

]}
