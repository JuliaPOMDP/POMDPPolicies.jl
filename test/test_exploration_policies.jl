using POMDPModels

problem =  SimpleGridWorld()
# e greedy
policy = EpsGreedyPolicy(problem, 0.5)
a = first(actions(problem))
@inferred action(policy, FunctionPolicy(s->a::Symbol), GWPos(1,1))
policy.eps = 0.0
@test action(policy, FunctionPolicy(s->a), GWPos(1,1)) == a

# softmax 
policy = SoftmaxPolicy(problem, 0.5)
on_policy = ValuePolicy(problem)
@inferred action(policy, on_policy, GWPos(1,1))

# test linear schedule 
policy = EpsGreedyPolicy(problem, 1.0, schedule=LinearDecaySchedule(start_val=1.0, end_val=0.0, steps=10))
for i=1:11 
    action(policy, FunctionPolicy(s->a), GWPos(1,1))
    @test policy.eps < 1.0 
end
@test policy.eps ≈ 0.0
