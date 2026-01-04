---
applyTo: "*"
description: "Tailwind CSS Best Practices"
---

# Tailwind CSS Best Practices

- **Utility First:** Use Tailwind utility classes for all styling. Do not create custom CSS classes in `.css` files unless absolutely necessary for complex animations (like the keyframes for the visualizer).
- **Sorting:** Order classes logically (Layout -> Box Model -> Typography -> Visuals -> Misc).
- **Colors:** strictly use the project palette:
  - Primary: `emerald-900` (Background/Accents)
  - Secondary: `gold-500` (Highlights/Text)
  - Base: `black` or `gray-900`
- **Responsiveness:** Use `sm:`, `md:`, `lg:` prefixes to ensure the player looks good on mobile phones.
