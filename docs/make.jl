using Documenter, POMDPPolicies

makedocs(
    modules = [POMDPPolicies],
    format = Documenter.HTML(),
    sitename = "POMDPPolicies.jl"
)

deploydocs(
    repo = "github.com/JuliaPOMDP/POMDPPolicies.jl.git",
)
