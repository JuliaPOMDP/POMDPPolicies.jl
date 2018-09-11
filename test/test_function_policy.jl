let
    p = FunctionPolicy(x::Bool->!x)
    @test action(p, true) == false

    s = FunctionSolver(x::Int->2*x)
    p = solve(s, GridWorld())
    @test action(p, 10) == 20
    @test action(p, 100) == 200
    updater(p) # just to make sure this doesn't error
end
