import Base: ==, hash

# Define struct not yet exported in POMDPs.jl framework
struct AlphaVec
    alpha::Vector{Float64} # alpha vector
    action::Any # action associated wtih alpha vector
end

AlphaVec() = AlphaVec([0.0], 0)

# define alpha vector equality
Base.hash(a::AlphaVec, h::UInt) = hash(a.alpha, hash(a.action, h))
==(a::AlphaVec, b::AlphaVec) = (a.alpha,a.action) == (b.alpha, b.action)

#test
let
    hor = 5
    pomdp = fixhorizon(TigerPOMDP(), hor)

    bu = DiscreteUpdater(pomdp.m)
    b0 = initialize_belief(bu, initialstate_distribution(pomdp.m))

    Γs = []
    # I only know correct alpha vectors from horizon stage
    for i in 1:4
        push!(Γs, [AlphaVec([0., 0.], 0), AlphaVec([0., 0.], 0), AlphaVec([0., 0.], 0)])
    end
    push!(Γs, [AlphaVec([10., 0.], 1), AlphaVec([0., 10.], 2), AlphaVec([-0.5, -0.5], 0)])


    staged_policies = [AlphaVectorPolicy(pomdp.m, length(stage_states(pomdp, t)), [a.alpha for a in Γs[t]],
        convert(Vector{actiontype(pomdp)}, [a.action for a in Γs[t]])) for t in 1:horizon(pomdp)]

    policy = StagedPolicy(pomdp, staged_policies)

    # these values were gotten from FiVI.jl tests
    @test Set(alphapairs(policy, hor)) == Set([[10., 0.]=>1, [0., 10.]=>2, [-0.5, -0.5]=>0])
    @test Set(alphavectors(policy, hor)) == Set([[10., 0.], [0., 10.], [-0.5, -0.5]])

    # initial belief is 50% tiger position confidence
    @test isapprox(value(policy, b0, hor), hor)
    @test isapprox(value(policy, [0.5, 0.5], hor), 5)
    # I am not sure whether the result should be [-0.5, 5. 5.] or [-1., 5. 5.]
    # may check the correctness in the future
    @test_broken isapprox(actionvalues(policy, b0, hor), [-1, 5., 5.])
    @test length(actionvalues(policy, b0, hor)) == length(actions(pomdp))

    # The agent only has one decision, so he has to risk choosing one door
    @test action(policy, b0, hor) == 1 || action(policy, b0, hor) == 2

    # try pushing new vector
    push!(policy, [0.0,0.0], 0, hor)
    @test isapprox(length(policy.staged_policies[hor].alphas), 4)

    # test infinite horizon pomdp
    pomdp = BabyPOMDP()
    @test_throws ArgumentError StagedPolicy(pomdp, staged_policies)
end
