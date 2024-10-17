# Rux

## Swarm Robot Intractions Simulator
![](/Documents/Screenshots/V1.png)

## Simulator Clean Architecture
- Core
    - Contains the business logic
    - Independent of other layers
    - Outer layers depends on abstractions defined in inner layers
- Application
    - Manages data flow between core and other layers
- Infrastructure
    - Implements interfaces defined in core
    - Deals wiht databases, ...
- Presentation
    - UI
    - Controllers/endpoints