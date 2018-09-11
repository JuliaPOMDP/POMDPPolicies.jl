using Test
using POMDPPolicies
using POMDPs
using BeliefUpdaters
# using POMDPSimulators
using POMDPModels

# @testset "alpha" begin
#     include("test_alpha_policy.jl")
# end
@testset "function" begin
    include("test_function_policy.jl")
end
# @testset "stochastic" begin
#     include("test_stochastic_policy.jl")
# end
# @testset "utility" begin
#     include("test_utility_wrapper.jl")
# end
# @testset "vector" begin
#     include("test_vector_policy.jl")
# end
