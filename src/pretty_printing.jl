"""
    showpolicy([io], [mime], m::MDP, p::Policy)
    showpolicy([io], [mime], statelist::AbstractVector, p::Policy_

Print the states in `m` or `statelist` and the actions from policy `p` corresponding to those states.

If `io[:limit]` is `true`, will only print enough states to fill the display.
"""
function showpolicy(io::IO, mime::MIME"text/plain", m::MDP, p::Policy)
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
    showpolicy(io, mime, slist, p)
end

function showpolicy(io::IO, mime::MIME"text/plain", slist::AbstractVector, p::Policy)
    S = eltype(slist)
    rows, cols = get(io, :displaysize, displaysize(io))
    ioc = IOContext(io, :compact => true, :displaysize => (1, cols))

    if get(io, :limit, false)
        for s in slist[1:min(rows-1, end)]
            print_sa_line(ioc, s, p, S)
        end
        if length(slist) == rows
            print_sa_line(ioc, last(slist), p, S)
        else
            println(" …")
        end
    else
        for s in slist
            print_sa_line(ioc, s, p, S)
        end
    end
end

showpolicy(io::IO, m::Union{MDP,AbstractVector}, p::Policy) = showpolicy(io, MIME("text/plain"), m, p)
showpolicy(m::Union{MDP,AbstractVector}, p::Policy) = showpolicy(stdout, m, p)

function print_sa_line(io::IO, s, p::Policy, S::Type)
    print(io, ' ')
    ds = get(io, :displaysize, displaysize(io))
    half_ds = (first(ds), div(last(ds)-5, 2))
    show(IOContext(io, :typeinfo => S, :displaysize => half_ds), s)
    print(io, " -> ")
    action_io = IOContext(io, :displaysize => half_ds)
    try
        show(action_io, action(p, s))
    catch ex
        showerror(action_io, ex)
    end
    println(io)
end

const PAIRTYPES = Union{Pair{M, P}, Tuple{M, P}} where {M<:MDP, P<:Policy}

function Base.show(io::IO, mime::MIME"text/plain", pair::PAIRTYPES)
    summary(io, pair)
    println(io)
    remaining = first(displaysize(io)) - 1
    ioc = IOContext(io, :displaysize => displaysize(io))
    showpolicy(ioc, first(pair), last(pair))
end

Base.show(io::IO, pair::PAIRTYPES) = show(io, MIME("text/plain"), pair)
