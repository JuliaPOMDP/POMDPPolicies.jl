
"""
    RandomPolicy{RNG<:AbstractRNG, P<:Union{POMDP,MDP}, U<:Updater}
a generic policy that uses the actions function to create a list of actions and then randomly samples an action from it.

Constructor:

    `PlaybackPolicy(actions::Vector{A}, backup_policy::Policy; logpdfs::Vector{Float64} = [])`

# Fields
- `actions::Vector{A}` a vector of actions to play back
- `backup_policy::Policy` the policy to use when all prescribed actions have been taken but the episode continues
- `logpdfs::Vector{Float64}` the log probability (density) of actions
- `i::Int64` the current action index
"""
mutable struct PlaybackPolicy{A} <: Policy
    actions::Vector{A}
    backup_policy::Policy
    logpdfs::Vector{Float64}
    i::Int64
end

# Constructor for the PlaybackPolicy
PlaybackPolicy(actions::Vector{A}, backup_policy::Policy; logpdfs::Vector{Float64} = Float64[]) where {A} = PlaybackPolicy(actions, backup_policy, logpdfs, 1)

# Action selection for the PlaybackPolicy
function POMDPs.action(p::PlaybackPolicy, s)
    a = p.i <= length(p.actions) ? p.actions[p.i] : action(p.backup_policy, s)
    p.i += 1
    a
end

# Get the logpdf of the history from the playback policy and the backup policy
function Distributions.logpdf(p::PlaybackPolicy, h)
    N = min(length(p.actions), length(h))
    # @assert all(collect(action_hist(h))[1:N] .== p.actions[1:N])
    @assert length(p.actions) == length(p.logpdfs)
    if length(h) > N
        return sum(p.logpdfs) + sum(logpdf(p.backup_policy, view(h, N+1:length(h))))
    else
        return sum(p.logpdfs[1:N])
    end
end


