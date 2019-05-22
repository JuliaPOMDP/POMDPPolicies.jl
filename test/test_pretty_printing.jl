let
    gw = SimpleGridWorld(size=(2,2))

    pvec = fill(:left, n_states(gw))

    solver = VectorSolver(pvec)

    p = solve(solver, gw)

    @test sprint(showpolicy, gw, p) == " [1, 1] -> :left\n [2, 1] -> :left\n [1, 2] -> :left\n [2, 2] -> :left\n [-1, -1] -> :left"

    iob = IOBuffer()
    io = IOContext(iob, :limit=>true, :displaysize=>(7, 7))
    showpolicy(io, gw, p, pre="@ ")
    @test String(take!(iob)) == "@ [1, 1] -> :left\n@ [2, 1] -> :left\n@ [1, 2] -> :left\n@ …"
end
