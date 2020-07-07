var documenterSearchIndex = {"docs":
[{"location":"utility_wrapper/#Utility-Wrapper","page":"Utility Wrapper","title":"Utility Wrapper","text":"","category":"section"},{"location":"utility_wrapper/","page":"Utility Wrapper","title":"Utility Wrapper","text":"A wrapper for policies to collect statistics and handle errors.","category":"page"},{"location":"utility_wrapper/","page":"Utility Wrapper","title":"Utility Wrapper","text":"PolicyWrapper","category":"page"},{"location":"utility_wrapper/#POMDPPolicies.PolicyWrapper","page":"Utility Wrapper","title":"POMDPPolicies.PolicyWrapper","text":"PolicyWrapper\n\nFlexible utility wrapper for a policy designed for collecting statistics about planning.\n\nCarries a function, a policy, and optionally a payload (that can be any type).\n\nThe function should typically be defined with the do syntax. Each time action is called on the wrapper, this function will be called.\n\nIf there is no payload, it will be called with two argments: the policy and the state/belief. If there is a payload, it will be called with three arguments: the policy, the payload, and the current state or belief. The function should return an appropriate action. The idea is that, in this function, action(policy, s) should be called, statistics from the policy/planner should be collected and saved in the payload, exceptions can be handled, and the action should be returned.\n\nConstructor\n\nPolicyWrapper(policy::Policy; payload=nothing)\n\nExample\n\nusing POMDPModels\nusing POMDPToolbox\n\nmdp = GridWorld()\npolicy = RandomPolicy(mdp)\ncounts = Dict(a=>0 for a in actions(mdp))\n\n# with a payload\nstatswrapper = PolicyWrapper(policy, payload=counts) do policy, counts, s\n    a = action(policy, s)\n    counts[a] += 1\n    return a\nend\n\nh = simulate(HistoryRecorder(max_steps=100), mdp, statswrapper)\nfor (a, count) in payload(statswrapper)\n    println(\"policy chose action $a $count of $(n_steps(h)) times.\")\nend\n\n# without a payload\nerrwrapper = PolicyWrapper(policy) do policy, s\n    try\n        a = action(policy, s)\n    catch ex\n        @warn(\"Caught error in policy; using default\")\n        a = :left\n    end\n    return a\nend\n\nh = simulate(HistoryRecorder(max_steps=100), mdp, errwrapper)\n\nFields\n\nf::F\npolicy::P\npayload::PL\n\n\n\n\n\n","category":"type"},{"location":"stochastic/#Stochastic-Policies","page":"Stochastic Policies","title":"Stochastic Policies","text":"","category":"section"},{"location":"stochastic/","page":"Stochastic Policies","title":"Stochastic Policies","text":"Types for representing randomized policies:","category":"page"},{"location":"stochastic/","page":"Stochastic Policies","title":"Stochastic Policies","text":"StochasticPolicy samples actions from an arbitrary distribution.\nUniformRandomPolicy samples actions uniformly (see RandomPolicy for a similar use)\nCategoricalTabularPolicy samples actions from a categorical distribution with weights given by a ValuePolicy.","category":"page"},{"location":"stochastic/","page":"Stochastic Policies","title":"Stochastic Policies","text":"StochasticPolicy","category":"page"},{"location":"stochastic/#POMDPPolicies.StochasticPolicy","page":"Stochastic Policies","title":"POMDPPolicies.StochasticPolicy","text":"StochasticPolicy{D, RNG <: AbstractRNG}\n\nRepresents a stochastic policy. Action are sampled from an arbitrary distribution.\n\nConstructor:\n\n`StochasticPolicy(distribution; rng=Random.GLOBAL_RNG)`\n\nFields\n\ndistribution::D\nrng::RNG a random number generator\n\n\n\n\n\n","category":"type"},{"location":"stochastic/","page":"Stochastic Policies","title":"Stochastic Policies","text":"CategoricalTabularPolicy","category":"page"},{"location":"stochastic/#POMDPPolicies.CategoricalTabularPolicy","page":"Stochastic Policies","title":"POMDPPolicies.CategoricalTabularPolicy","text":"CategoricalTabularPolicy\n\nrepresents a stochastic policy sampling an action from a categorical distribution with weights given by a ValuePolicy\n\nconstructor:\n\nCategoricalTabularPolicy(mdp::Union{POMDP,MDP}; rng=Random.GLOBAL_RNG)\n\nFields\n\nstochastic::StochasticPolicy\nvalue::ValuePolicy\n\n\n\n\n\n","category":"type"},{"location":"showpolicy/#Pretty-Printing-Policies","page":"Pretty Printing Policies","title":"Pretty Printing Policies","text":"","category":"section"},{"location":"showpolicy/","page":"Pretty Printing Policies","title":"Pretty Printing Policies","text":"showpolicy","category":"page"},{"location":"showpolicy/#POMDPPolicies.showpolicy","page":"Pretty Printing Policies","title":"POMDPPolicies.showpolicy","text":"showpolicy([io], [mime], m::MDP, p::Policy)\nshowpolicy([io], [mime], statelist::AbstractVector, p::Policy)\nshowpolicy(...; pre=\" \")\n\nPrint the states in m or statelist and the actions from policy p corresponding to those states.\n\nFor the MDP version, if io[:limit] is true, will only print enough states to fill the display.\n\n\n\n\n\n","category":"function"},{"location":"random/#Random-Policy","page":"Random Policy","title":"Random Policy","text":"","category":"section"},{"location":"random/","page":"Random Policy","title":"Random Policy","text":"A policy that returns a randomly selected action using rand(rng, actions(pomdp)).","category":"page"},{"location":"random/","page":"Random Policy","title":"Random Policy","text":"RandomPolicy","category":"page"},{"location":"random/#POMDPPolicies.RandomPolicy","page":"Random Policy","title":"POMDPPolicies.RandomPolicy","text":"RandomPolicy{RNG<:AbstractRNG, P<:Union{POMDP,MDP}, U<:Updater}\n\na generic policy that uses the actions function to create a list of actions and then randomly samples an action from it.\n\nConstructor:\n\n`RandomPolicy(problem::Union{POMDP,MDP};\n         rng=Random.GLOBAL_RNG,\n         updater=NothingUpdater())`\n\nFields\n\nrng::RNG a random number generator \nprobelm::P the POMDP or MDP problem \nupdater::U a belief updater (default to NothingUpdater in the above constructor)\n\n\n\n\n\n","category":"type"},{"location":"random/","page":"Random Policy","title":"Random Policy","text":"RandomSolver","category":"page"},{"location":"random/#POMDPPolicies.RandomSolver","page":"Random Policy","title":"POMDPPolicies.RandomSolver","text":"solver that produces a random policy\n\n\n\n\n\n","category":"type"},{"location":"exploration_policies/#Exploration-Policies","page":"Exploration Policies","title":"Exploration Policies","text":"","category":"section"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"Exploration policies are often useful for Reinforcement Learning algorithm to choose an action that is different than the action given by the policy being learned (on_policy). ","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"Exploration policies are subtype of the abstract ExplorationPolicy type and they follow the following interface:  action(exploration_policy::ExplorationPolicy, on_policy::Policy, k, s). k is used to compute the value of the exploration parameter (see Schedule), and s is the current state or observation in which the agent is taking an action.","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"The action method is exported by POMDPs.jl.  To use exploration policies in a solver, you must use the four argument version of action where on_policy is the policy being learned (e.g. tabular policy or neural network policy).","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"This package provides two exploration policies: EpsGreedyPolicy and SoftmaxPolicy","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"    EpsGreedyPolicy\n    SoftmaxPolicy","category":"page"},{"location":"exploration_policies/#POMDPPolicies.EpsGreedyPolicy","page":"Exploration Policies","title":"POMDPPolicies.EpsGreedyPolicy","text":"EpsGreedyPolicy <: ExplorationPolicy\n\nrepresents an epsilon greedy policy, sampling a random action with a probability eps or returning an action from a given policy otherwise. The evolution of epsilon can be controlled using a schedule. This feature is useful for using those policies in reinforcement learning algorithms. \n\nConstructor:\n\nEpsGreedyPolicy(problem::Union{MDP, POMDP}, eps::Union{Function, Float64}; rng=Random.GLOBAL_RNG, schedule=ConstantSchedule)\n\nIf a function is passed for eps, eps(k) is called to compute the value of epsilon when calling action(exploration_policy, on_policy, k, s).\n\nFields\n\neps::Function\nrng::AbstractRNG\nactions::A an indexable list of action\n\n\n\n\n\n","category":"type"},{"location":"exploration_policies/#POMDPPolicies.SoftmaxPolicy","page":"Exploration Policies","title":"POMDPPolicies.SoftmaxPolicy","text":"SoftmaxPolicy <: ExplorationPolicy\n\nrepresents a softmax policy, sampling a random action according to a softmax function.  The softmax function converts the action values of the on policy into probabilities that are used for sampling.  A temperature parameter or function can be used to make the resulting distribution more or less wide.\n\nConstructor\n\nSoftmaxPolicy(problem, temperature::Union{Function, Float64}; rng=Random.GLOBAL_RNG)\n\nIf a function is passed for temperature, temperature(k) is called to compute the value of the temperature when calling action(exploration_policy, on_policy, k, s)\n\nFields\n\ntemperature::Function\nrng::AbstractRNG\nactions::A an indexable list of action\n\n\n\n\n\n","category":"type"},{"location":"exploration_policies/#Schedule","page":"Exploration Policies","title":"Schedule","text":"","category":"section"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"Exploration policies often rely on a key parameter: epsilon in epsilon-greedy and the temperature in softmax for example.  Reinforcement learning algorithms often require a decay schedule for these parameters.  Schedule can be passed to an exploration policy as functions. For example one can define an epsilon greedy policy with an exponential decay schedule as follow: ","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"    m # your mdp or pomdp model\n    exploration_policy = EpsGreedyPolicy(m, k->0.05*0.9^(k/10))","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"POMDPPolicies.jl exports a linear decay schedule object that can be used as well.  ","category":"page"},{"location":"exploration_policies/","page":"Exploration Policies","title":"Exploration Policies","text":"    LinearDecaySchedule ","category":"page"},{"location":"exploration_policies/#POMDPPolicies.LinearDecaySchedule","page":"Exploration Policies","title":"POMDPPolicies.LinearDecaySchedule","text":"LinearDecaySchedule\n\nA schedule that linearly decreases a value from start to stop in steps steps. if the value is greater or equal to stop, it stays constant.\n\nConstructor\n\nLinearDecaySchedule(;start, stop, steps)\n\n\n\n\n\n","category":"type"},{"location":"vector/#Vector-Policy","page":"Vector Policy","title":"Vector Policy","text":"","category":"section"},{"location":"vector/","page":"Vector Policy","title":"Vector Policy","text":"Tabular policies including the following:","category":"page"},{"location":"vector/","page":"Vector Policy","title":"Vector Policy","text":"VectorPolicy holds a vector of actions, one for each state, ordered according to state_index.\nValuePolicy holds a matrix of values for state-action pairs and chooses the action with the highest value at the given state","category":"page"},{"location":"vector/","page":"Vector Policy","title":"Vector Policy","text":"VectorPolicy ","category":"page"},{"location":"vector/#POMDPPolicies.VectorPolicy","page":"Vector Policy","title":"POMDPPolicies.VectorPolicy","text":"VectorPolicy{S,A}\n\nA generic MDP policy that consists of a vector of actions. The entry at stateindex(mdp, s) is the action that will be taken in state s.\n\nFields\n\nmdp::MDP{S,A} the MDP problem\nact::Vector{A} a vector of size |S| mapping state indices to actions\n\n\n\n\n\n","category":"type"},{"location":"vector/","page":"Vector Policy","title":"Vector Policy","text":"VectorSolver","category":"page"},{"location":"vector/#POMDPPolicies.VectorSolver","page":"Vector Policy","title":"POMDPPolicies.VectorSolver","text":"VectorSolver{A}\n\nSolver for VectorPolicy. Doesn't do any computation - just sets the action vector.\n\nFields\n\nact::Vector{A} the action vector\n\n\n\n\n\n","category":"type"},{"location":"vector/","page":"Vector Policy","title":"Vector Policy","text":"ValuePolicy","category":"page"},{"location":"vector/#POMDPPolicies.ValuePolicy","page":"Vector Policy","title":"POMDPPolicies.ValuePolicy","text":" ValuePolicy{P<:Union{POMDP,MDP}, T<:AbstractMatrix{Float64}, A}\n\nA generic MDP policy that consists of a value table. The entry at stateindex(mdp, s) is the action that will be taken in state s. It is expected that the order of the actions in the value table is consistent with the order of the actions in act.  If act is not explicitly set in the construction, act is ordered according to actionindex.\n\nFields\n\nmdp::P the MDP problem\nvalue_table::T the value table as a |S|x|A| matrix\nact::Vector{A} the possible actions\n\n\n\n\n\n","category":"type"},{"location":"#About","page":"About","title":"About","text":"","category":"section"},{"location":"","page":"About","title":"About","text":"POMDPPolicies provides a collection of policy types for POMDPs.jl.","category":"page"},{"location":"","page":"About","title":"About","text":"It currently provides:","category":"page"},{"location":"","page":"About","title":"About","text":"an alpha vector policy type\na random policy\na stochastic policy type\nexploration policies\na vector policy type\na wrapper to collect statistics and errors about policies","category":"page"},{"location":"","page":"About","title":"About","text":"In addition, it provides the showpolicy function for printing policies similar to the way that matrices are printed in the repl.","category":"page"},{"location":"","page":"About","title":"About","text":"","category":"page"},{"location":"alpha_vector/#Alpha-Vector-Policy","page":"Alpha Vector Policy","title":"Alpha Vector Policy","text":"","category":"section"},{"location":"alpha_vector/","page":"Alpha Vector Policy","title":"Alpha Vector Policy","text":"Represents a policy with a set of alpha vectors (See AlphaVectorPolicy constructor docstring). In addition to finding the optimal action with action, the alpha vectors can be accessed with alphavectors or alphapairs.","category":"page"},{"location":"alpha_vector/","page":"Alpha Vector Policy","title":"Alpha Vector Policy","text":"Determining the estimated value and optimal action depends on calculating the dot product between alpha vectors and a belief vector. POMDPPolicies.beliefvec(pomdp, b) is used to create this vector and can be overridden for new belief types for efficiency.","category":"page"},{"location":"alpha_vector/","page":"Alpha Vector Policy","title":"Alpha Vector Policy","text":"AlphaVectorPolicy\nalphavectors\nalphapairs\nPOMDPPolicies.beliefvec","category":"page"},{"location":"alpha_vector/#POMDPPolicies.AlphaVectorPolicy","page":"Alpha Vector Policy","title":"POMDPPolicies.AlphaVectorPolicy","text":"AlphaVectorPolicy(pomdp::POMDP, alphas, action_map)\n\nConstruct a policy from alpha vectors.\n\nArguments\n\nalphas: an |S| x (number of alpha vecs) matrix or a vector of alpha vectors.\naction_map: a vector of the actions correponding to each alpha vector\nAlphaVectorPolicy{P<:POMDP, A}\n\nRepresents a policy with a set of alpha vectors.\n\nUse action to get the best action for a belief, and alphavectors and alphapairs to \n\nFields\n\npomdp::P the POMDP problem \nn_states::Int the number of states in the POMDP\nalphas::Vector{Vector{Float64}} the list of alpha vectors\naction_map::Vector{A} a list of action corresponding to the alpha vectors\n\n\n\n\n\n","category":"type"},{"location":"alpha_vector/#POMDPPolicies.alphavectors","page":"Alpha Vector Policy","title":"POMDPPolicies.alphavectors","text":"Return the alpha vectors.\n\n\n\n\n\n","category":"function"},{"location":"alpha_vector/#POMDPPolicies.alphapairs","page":"Alpha Vector Policy","title":"POMDPPolicies.alphapairs","text":"Return an iterator of alpha vector-action pairs in the policy.\n\n\n\n\n\n","category":"function"},{"location":"alpha_vector/#POMDPPolicies.beliefvec","page":"Alpha Vector Policy","title":"POMDPPolicies.beliefvec","text":"POMDPPolicies.beliefvec(m::POMDP, n_states::Int, b)\n\nReturn a vector-like representation of the belief b suitable for calculating the dot product with the alpha vectors.\n\n\n\n\n\n","category":"function"},{"location":"function/#Function","page":"Function","title":"Function","text":"","category":"section"},{"location":"function/","page":"Function","title":"Function","text":"A policy represented by a function. ","category":"page"},{"location":"function/","page":"Function","title":"Function","text":"FunctionPolicy","category":"page"},{"location":"function/#POMDPPolicies.FunctionPolicy","page":"Function","title":"POMDPPolicies.FunctionPolicy","text":"FunctionPolicy\n\nPolicy p=FunctionPolicy(f) returns f(x) when action(p, x) is called.\n\n\n\n\n\n","category":"type"},{"location":"function/","page":"Function","title":"Function","text":"FunctionSolver","category":"page"},{"location":"function/#POMDPPolicies.FunctionSolver","page":"Function","title":"POMDPPolicies.FunctionSolver","text":"FunctionSolver\n\nSolver for a FunctionPolicy.\n\n\n\n\n\n","category":"type"}]
}
