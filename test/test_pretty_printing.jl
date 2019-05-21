let
    gw = SimpleGridWorld(size=(2,2))

    pvec = fill(:left, n_states(gw))

    solver = VectorSolver(pvec)

    p = solve(solver, gw)

    display(gw=>p)
end
