module POMDPPolicies

using LinearAlgebra
using Random
using StatsBase # for Weights
using SparseArrays # for sparse vectors in alpha_vector.jl

using POMDPs
import POMDPs: action, value, solve, updater

using BeliefUpdaters
using POMDPModelTools

"""
    actionvalues(p::Policy, s)

returns the values of each action at state s in a vector
"""
function actionvalues end

export 
    actionvalues

export
    AlphaVectorPolicy

include("alpha_vector.jl")

export
    FunctionPolicy,
    FunctionSolver

include("function.jl")

export
    RandomPolicy,
    RandomSolver

include("random.jl")

export
    VectorPolicy,
    VectorSolver,
    ValuePolicy

include("vector.jl")

export
    StochasticPolicy,
    UniformRandomPolicy,
    CategoricalTabularPolicy,
    EpsGreedyPolicy

include("stochastic.jl")

export
    PolicyWrapper,
    payload

include("utility_wrapper.jl")


end
