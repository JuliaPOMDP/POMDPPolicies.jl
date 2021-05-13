
"""
StagedPolicy

Policy for finite horizon POMDP solvers.
Wraps multiple Policies, one for each stage.
"""
struct StagedPolicy{M<:FiniteHorizonPOMDPs.FHWrapper, P<:Policy}<:Policy
    pomdp::M
    staged_policies::Array{P, 1}
end


### functional methods ###
value(p::StagedPolicy, b, t) = t <= horizon(p.pomdp) ? value(p.staged_policies[t], b) : 0.

action(p::StagedPolicy, b, t) = t <= horizon(p.pomdp) ? action(p.staged_policies[t], b) : ordered_actions(p.pomdp)[1]

# Given that, for example, POMDPSimulators.jl does not work with action(p, b, t),
# we need to somehow introduce the stage variable
action(p::StagedPolicy, b::DiscreteBelief) = action(p, b, stage(p.pomdp, b.state_list[1]))


# I am not sure whether this should be
updater(p::StagedPolicy) = DiscreteUpdater(p.pomdp)
# or
updater(p::StagedPolicy, t) = DiscreteUpdater(p.staged_policies[t].pomdp)

"""
Return an iterator of alpha vector-action pairs of given stage in the policy.
"""
alphapairs(p::StagedPolicy, t::Int64) = alphapairs(p.staged_policies[t])

"""
Return the alpha vectors of given stage
"""
alphavectors(p::StagedPolicy, t::Int64) = alphavectors(p.staged_policies[t])

actionvalues(p::StagedPolicy, b, t::Int64) = actionvalues(p.staged_policies[t], b)

function Base.push!(p::StagedPolicy, alpha::Vector{Float64}, a, t)
    push!(p.staged_policies[t].alphas, alpha)
    push!(p.staged_policies[t].action_map, a)
end
