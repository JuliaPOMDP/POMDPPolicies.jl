######################################################################
# alpha_vector.jl
#
# implements policy that is a set of alpha vectors
######################################################################

"""
    AlphaVectorPolicy{P<:POMDP, A}

Represents a policy with a set of alpha vector 

Constructor: 

    `AlphaVectorPolicy(pomdp::POMDP, alphas)`

alphas can be a matrix or a vector of vectors

# Fields
- `pomdp::P` the POMDP problem 
- `alphas::Vector{Vector{Float64}}` the list of alpha vectors
- `action_map::Vector{A}` a list of action corresponding to the alpha vectors
"""
struct AlphaVectorPolicy{P<:POMDP, A} <: Policy
    pomdp::P
    alphas::Vector{Vector{Float64}}
    action_map::Vector{A}
end
function AlphaVectorPolicy(pomdp::POMDP, alphas)
    AlphaVectorPolicy(pomdp, alphas, ordered_actions(pomdp))
end
# assumes alphas is |S| x |A|
function AlphaVectorPolicy(p::POMDP, alphas::Matrix{Float64}, action_map)
    # turn alphas into vector of vectors
    num_actions = size(alphas, 2)
    alpha_vecs = Vector{Float64}[]
    for i = 1:num_actions
        push!(alpha_vecs, vec(alphas[:,i]))
    end

    AlphaVectorPolicy(p, alpha_vecs, action_map)
end



updater(p::AlphaVectorPolicy) = DiscreteUpdater(p.pomdp)

value(p::AlphaVectorPolicy, b::DiscreteBelief) = value(p, b.b)
function value(p::AlphaVectorPolicy, b::Vector{Float64})
    maximum(dot(b,a) for a in p.alphas)
end

function action(p::AlphaVectorPolicy, b::DiscreteBelief)
    num_vectors = length(p.alphas)
    best_idx = 1
    max_value = -Inf
    for i = 1:num_vectors
        temp_value = dot(b.b, p.alphas[i])
        if temp_value > max_value
            max_value = temp_value
            best_idx = i
        end
    end
    return p.action_map[best_idx]
end

function actionvalues(p::AlphaVectorPolicy, b::DiscreteBelief)
    num_vectors = length(p.alphas)
    max_values = -Inf*ones(n_actions(p.pomdp))
    for i = 1:num_vectors
        temp_value = dot(b.b, p.alphas[i])
        ai = actionindex(p.pomdp, p.action_map[i]) 
        if temp_value > max_values[ai]
            max_values[ai] = temp_value
        end
    end
    return max_values
end

function value(p::AlphaVectorPolicy, b::SparseCat)
    maximum(sparsecat_dot(p.pomdp, a, b) for a in p.alphas)
end

function action(p::AlphaVectorPolicy, b::SparseCat)
    num_vectors = length(p.alphas)
    best_idx = 1
    max_value = -Inf
    for i = 1:num_vectors
        temp_value = sparsecat_dot(p.pomdp, p.alphas[i], b)
        if temp_value > max_value
            max_value = temp_value
            best_idx = i
        end
    end
    return p.action_map[best_idx]
end
    
function actionvalues(p::AlphaVectorPolicy, b::SparseCat)
    num_vectors = length(p.alphas)
    max_values = -Inf*ones(n_actions(p.pomdp))
    for i = 1:num_vectors
        temp_value = sparsecat_dot(p.pomdp, p.alphas[i], b)
        ai = actionindex(p.pomdp, p.action_map[i])
        if ( temp_value > max_values[ai])
            max_values[ai] = temp_value
        end
    end
    return max_values
 end
 
# perform dot product between an alpha vector and a sparse cat object
function sparsecat_dot(problem::POMDP, alpha::Vector{Float64}, b::SparseCat)
   val = 0.
   for (s, p) in weighted_iterator(b)
       si = stateindex(problem, s)
       val += alpha[si]*p
   end
   return val
end

function Base.push!(p::AlphaVectorPolicy, alpha::Vector{Float64}, a)
    push!(p.alphas, alpha)
    push!(p.action_map, a)
end
