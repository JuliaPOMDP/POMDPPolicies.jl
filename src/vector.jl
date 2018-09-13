### Vector Policy ###
# maintained by @zsunberg and @etotheipluspi

"""
A generic MDP policy that consists of a vector of actions. The entry at `stateindex(mdp, s)` is the action that will be taken in state `s`.
"""
mutable struct VectorPolicy{S,A} <: Policy
    mdp::MDP{S,A}
    act::Vector{A}
end

action(p::VectorPolicy, s) = p.act[stateindex(p.mdp, s)]
action(p::VectorPolicy, s, a) = action(p, s)

"""
Solver for VectorPolicy. Doesn't do any computation - just sets the action vector.
"""
mutable struct VectorSolver{A}
    act::Vector{A}
end

function solve(s::VectorSolver{A}, mdp::MDP{S,A}) where {S,A}
    return VectorPolicy{S,A}(mdp, s.act)
end


"""
A generic MDP policy that consists of a value table. The entry at `stateindex(mdp, s)` is the action that will be taken in state `s`.
"""
mutable struct ValuePolicy{P<:Union{POMDP,MDP}, T<:AbstractMatrix{Float64}, A} <: Policy
    mdp::P
    value_table::T
    act::Vector{A}
end
function ValuePolicy(mdp::Union{MDP,POMDP}, value_table = zeros(n_states(mdp), n_actions(mdp)))
    acts = Any[]
    for a in actions(mdp)
        push!(acts, a)
    end
    return ValuePolicy(mdp, value_table, acts)
end

action(p::ValuePolicy, s) = p.act[argmax(p.value_table[stateindex(p.mdp, s),:])]
