"""
    showpolicy([io], [mime], m::MDP, p::Policy)
    showpolicy([io], [mime], statelist::AbstractVector, p::Policy)
    showpolicy(...; pre=" ")

Print the states in `m` or `statelist` and the actions from policy `p` corresponding to those states.

If `io[:limit]` is `true`, will only print enough states to fill the display.
"""
function showpolicy(io::IO, mime::MIME"text/plain", m::MDP, p::Policy; kwargs...)
    slist = nothing
    try
        slist = ordered_states(m)
    catch
        try
            slist = collect(states(m))
        catch ex
            @info("""Unable to pretty-print policy:
                  $(sprint(showerror, ex))
                  """)
            show(io, mime, m)
            return show(io, mime, p)
        end
    end
    showpolicy(io, mime, slist, p; kwargs...)
end

function showpolicy(io::IO, mime::MIME"text/plain", slist::AbstractVector, p::Policy; pre::AbstractString=" ")
    S = eltype(slist)
    rows, cols = get(io, :displaysize, displaysize(io))
    ioc = IOContext(io, :compact => true, :displaysize => (1, cols-length(pre)))

    if get(io, :limit, false)
        for s in slist[1:min(rows-1, end)]
            print(ioc, pre)
            print_sa(ioc, s, p, S)
            println(ioc)
        end
        if length(slist) == rows
            print(ioc, pre)
            print_sa(ioc, last(slist), p, S)
            println(ioc)
        elseif length(slist) > rows
            println(ioc, pre, "…")
        end
    else
        for s in slist
            print(ioc, pre)
            print_sa(ioc, s, p, S)
            println(ioc)
        end
    end
end

showpolicy(io::IO, m::Union{MDP,AbstractVector}, p::Policy; kwargs...) = showpolicy(io, MIME("text/plain"), m, p; kwargs...)
showpolicy(m::Union{MDP,AbstractVector}, p::Policy; kwargs...) = showpolicy(stdout, m, p; kwargs...)

function print_sa(io::IO, s, p::Policy, S::Type)
    ds = get(io, :displaysize, displaysize(io))
    half_ds = (first(ds), div(last(ds)-4, 2))
    show(IOContext(io, :typeinfo => S, :displaysize => half_ds), s)
    print(io, " -> ")
    action_io = IOContext(io, :displaysize => half_ds)
    try
        show(action_io, action(p, s))
    catch ex
        showerror(action_io, ex)
    end
end
