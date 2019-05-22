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
    rows -= 3 # Yuck! This magic number is also in Base.print_matrix
    sa_con = IOContext(io, :compact => true)

    if !isempty(slist)
        if get(io, :limit, false)
            # print first element without a newline
            print(io, pre)
            print_sa(sa_con, first(slist), p, S)

            # print middle elements
            for s in slist[2:min(rows-1, end)]
                print(io, '\n', pre)
                print_sa(sa_con, s, p, S)
            end

            # print last element or ...
            if length(slist) == rows
                print(io, '\n', pre)
                print_sa(sa_con, last(slist), p, S)
            elseif length(slist) > rows
                print(io, '\n', pre, "…")
            end
        else
            # print first element without a newline
            print(io, pre)
            print_sa(sa_con, first(slist), p, S)

            # print all other elements
            for s in slist[2:end]
                print(io, '\n', pre)
                print_sa(sa_con, s, p, S)
            end
        end
    end
end

showpolicy(io::IO, m::Union{MDP,AbstractVector}, p::Policy; kwargs...) = showpolicy(io, MIME("text/plain"), m, p; kwargs...)
showpolicy(m::Union{MDP,AbstractVector}, p::Policy; kwargs...) = showpolicy(stdout, m, p; kwargs...)

function print_sa(io::IO, s, p::Policy, S::Type)
    show(IOContext(io, :typeinfo => S), s)
    print(io, " -> ")
    try
        show(io, action(p, s))
    catch ex
        showerror(IOContext(io, :limit=>true), ex)
    end
end
