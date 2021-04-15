

"""
    StagedAlphaVectorPolicy

Policy for finite horizon POMDP solvers.
Wraps multiple Alpha Vector Policies, one for each stage
"""
struct StagedAlphaVectorPolicy <: Policy
    pomdp::Union{MDP, POMDP}
    alpha_vector_policies::Vector{AlphaVectorPolicy}
end

# assumes vector if (horizon(pomdp) + 1) array with |S| x (number of alpha vecs) dimensions
function StagedAlphaVectorPolicy(pomdp, alphas::Array{Array{Float64, 2}, 1}, action_map)
    num_stages = size(alphas, 1)
    alpha_vector_policies = Vector{AlphaVectorPolicy}(undef, num_stages)
    for t in 1:num_stages
        alpha_vector_policies[t] = AlphaVectorPolicy(pomdp, alphas[t], action_map[t], t)
    end

    return StagedAlphaVectorPolicy(pomdp, alpha_vector_policies)
end

"""
    AlphaVectorPolicy(p::POMDP, alphas::Matrix{Float64}, action_map, t)

Almost the same function as constructor in alpha_vector.jl, 
but this one uses stage_states instead of states to store number of given stahe instead of all pomdp
assumes alphas is |S| x (number of alpha vecs)
"""
function AlphaVectorPolicy(p::POMDP, alphas::Matrix{Float64}, action_map, t)
    # turn alphas into vector of vectors
    num_actions = size(alphas, 2)
    alpha_vecs = Vector{Float64}[]
    for i = 1:num_actions
        push!(alpha_vecs, vec(alphas[:,i]))
    end

    AlphaVectorPolicy(p.m, length(stage_states(p, t)), alpha_vecs,
                      convert(Vector{actiontype(p)}, action_map))
end

### functional methods ###
value(p::StagedAlphaVectorPolicy, b, t) = t <= horizon(p.pomdp) ? value(p.alpha_vector_policies[t], b) : 0.

action(p::StagedAlphaVectorPolicy, b, t) = t <= horizon(p.pomdp) ? action(p.alpha_vector_policies[t], b) : -1


### methods not tested yet ###

updater(p::StagedAlphaVectorPolicy) = DiscreteUpdater(p.pomdp)

"""
Return an iterator of alpha vector-action pairs of given stage in the policy.
"""
alphapairs(p::StagedAlphaVectorPolicy, t::Int64) = alphapairs(p.alpha_vector_policies[t])

"""
Return the alpha vectors of given stage
"""
alphavectors(p::StagedAlphaVectorPolicy, t::Int64) = alphavectors(p.alpha_vector_policies[t])

# The three functions below rely on beliefvec being implemented for the belief type
# Implementations of beliefvec are below

actionvalues(p::StagedAlphaVectorPolicy, b) = actionvalues(p.alpha_vector_policies[t], b)

function Base.push!(p::StagedAlphaVectorPolicy, alpha::Vector{Float64}, a, t)
    push!(p.alpha_vector_policies[t].alphas, alpha)
    push!(p.alpha_vector_policies[t].action_map, a)
end
