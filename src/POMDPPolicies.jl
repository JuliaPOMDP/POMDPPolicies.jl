module POMDPPolicies

Base.depwarn("""
             The functionality of POMDPPolicies has been moved to POMDPTools.

             Please replace `using POMDPPolicies` with `using POMDPTools`.
             """, :POMDPPolicies)

using Reexport

@reexport using POMDPTools.Policies

end
