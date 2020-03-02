

# exploration schedule 
"""
    ExplorationSchedule
Abstract type for exploration schedule. 
It is useful to define the schedule of a parameter of an exploration policy.
The effect of a schedule is defined by the `update_value` function.
"""
abstract type ExplorationSchedule end 

"""
    update_value(::ExplorationSchedule, value)
Returns an updated value according to the schedule.
"""
function update_value(::ExplorationSchedule, value) end


"""
    LinearDecaySchedule
A schedule that linearly decreases a value from `start_val` to `end_val` in `steps` steps.
if the value is greater or equal to `end_val`, it stays constant.

# Constructor 

`LinearDecaySchedule(;start_val, end_val, steps)`
"""
@with_kw struct LinearDecaySchedule{R<:Real} <: ExplorationSchedule
    start_val::R
    end_val::R
    steps::Int
end

function update_value(schedule::LinearDecaySchedule, value)
    rate = (schedule.start_val - schedule.end_val) / schedule.steps
    new_value = max(value - rate, schedule.end_val)
end

"""
    ConstantSchedule
A schedule that keeps the value constant
"""
struct ConstantSchedule <: ExplorationSchedule 
end 

update_value(::ConstantSchedule, value) = value


"""
    ExplorationPolicy <: Policy
An abstract type for exploration policies.
Sampling from an exploration policy is done using `action(exploration_policy, on_policy, state)`
"""
abstract type ExplorationPolicy <: Policy end



"""
    EpsGreedyPolicy <: ExplorationPolicy

represents an epsilon greedy policy, sampling a random action with a probability `eps` or returning an action from a given policy otherwise.
The evolution of epsilon can be controlled using a schedule. This feature is useful for using those policies in reinforcement learning algorithms. 

constructor:

`EpsGreedyPolicy(problem::Union{MDP, POMDP}, eps::Float64; rng=Random.GLOBAL_RNG, schedule=ConstantSchedule)`
"""
mutable struct EpsGreedyPolicy{T<:Real, S<:ExplorationSchedule, R<:AbstractRNG, A} <: ExplorationPolicy
    eps::T
    schedule::S
    rng::R
    actions::A
end

function EpsGreedyPolicy(problem::Union{MDP, POMDP}, eps::Real; 
                         rng::AbstractRNG=Random.GLOBAL_RNG, 
                         schedule::ExplorationSchedule=ConstantSchedule())
    return EpsGreedyPolicy(eps, schedule, rng, actions(problem))
end


function POMDPs.action(p::EpsGreedyPolicy{T}, on_policy::Policy, s) where T<:Real
    p.eps = update_value(p.schedule, p.eps)
    if rand(p.rng) < p.eps
        return rand(p.rng, p.actions)
    else 
        return action(on_policy, s)
    end
end

# softmax 
"""
    SoftmaxPolicy <: ExplorationPolicy

represents a softmax policy, sampling a random action according to a softmax function. 
The softmax function converts the action values of the on policy into probabilities that are used for sampling. 
A temperature parameter can be used to make the resulting distribution more or less wide.
"""
mutable struct SoftmaxPolicy{T<:Real, S<:ExplorationSchedule, R<:AbstractRNG, A} <: ExplorationPolicy
    temperature::T
    schedule::S
    rng::R
    actions::A
end

function SoftmaxPolicy(problem, temperature::Real; 
                       rng::AbstractRNG=Random.GLOBAL_RNG, 
                       schedule::ExplorationSchedule=ConstantSchedule())
    return SoftmaxPolicy(temperature, schedule, rng, actions(problem))
end

function POMDPs.action(p::SoftmaxPolicy, on_policy::Policy, s)
    p.temperature = update_value(p.schedule, p.temperature)
    vals = actionvalues(on_policy, s)
    vals ./= p.temperature
    maxval = maximum(vals)
    exp_vals = exp.(vals .- maxval)
    exp_vals /= sum(exp_vals)
    return p.actions[sample(p.rng, Weights(exp_vals))]
end
