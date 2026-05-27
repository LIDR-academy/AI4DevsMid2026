---
name: LTI Brutalist HR
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#484831'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#79785f'
  outline-variant: '#cac8aa'
  surface-tint: '#626200'
  primary: '#626200'
  on-primary: '#ffffff'
  primary-container: '#ffff00'
  on-primary-container: '#757500'
  inverse-primary: '#cdcd00'
  secondary: '#0035c6'
  on-secondary: '#ffffff'
  secondary-container: '#0448ff'
  on-secondary-container: '#d6daff'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#f7f7f7'
  on-tertiary-container: '#717171'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaea00'
  primary-fixed-dim: '#cdcd00'
  on-primary-fixed: '#1d1d00'
  on-primary-fixed-variant: '#494900'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b9c3ff'
  on-secondary-fixed: '#001257'
  on-secondary-fixed-variant: '#0033c0'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '900'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
  body-lg:
    fontFamily: Arimo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Arimo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  label-sm:
    fontFamily: Arimo
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  border-width: 2px
---

## Brand & Style

This design system is built on the principles of **Neo-Brutalism**, specifically tailored for an HR management context where clarity, speed, and structural integrity are paramount. The design narrative rejects soft abstractions in favor of a "printed UI" aesthetic—mimicking physical documentation, industrial signage, and high-contrast ledger sheets.

The personality is unapologetically utilitarian and authoritative. It targets HR professionals and employees who value efficiency over decoration. The emotional response is one of absolute transparency; there are no hidden depths or ambiguous surfaces. Every element is bound by strict black borders, suggesting a platform that is robust, organized, and reliable.

## Colors

The palette is driven by high-visibility "Safety" tones to denote action and status.

- **Canvas:** #F5F5F5 (Off-white) acts as the primary background, reducing eye strain compared to pure white while maintaining a paper-like feel.
- **Accents:** #FFFF00 (Safety Yellow) is reserved for high-priority actions, warnings, and active states. #0047FF (Electric Blue) is used for secondary actions, links, and data visualization.
- **Structure:** #000000 (Pure Black) is used for all borders, text, and structural dividers. 
- **Functional States:** Success is rendered in pure black or a high-contrast green, while critical errors must use the primary yellow with black text for maximum urgency.

## Typography

The typography strategy employs a hierarchy of "Confidence and Utility." 

- **Headlines:** Use Hanken Grotesk with tight letter spacing and heavy weights. They should feel "stamped" onto the page.
- **Body:** Arimo provides a neutral, neo-grotesque readability that balances the aggressive headlines. It ensures long-form data (employee records, policy text) remains highly legible.
- **Technical Data:** Space Mono is used for labels, metadata, and ID numbers, reinforcing the "systematized" feel of an HR tool. 
- **Treatment:** Avoid italics. Use bolding and scale for emphasis. Large headlines should overflow or sit tight against grid lines.

## Layout & Spacing

This design system uses a strict 12-column fluid grid for desktop and a single-column stack for mobile. 

- **Grid Alignment:** All elements must align to the grid lines. Component borders should visually overlap the grid to create a "locked-in" appearance.
- **Rhythm:** A 4px baseline grid governs all spacing. Vertical margins between sections are generous (32px+) to prevent the heavy borders from feeling cluttered.
- **Dividers:** Use 2px black lines for all horizontal and vertical divisions. Do not use white space alone to separate content; use a physical border.
- **Margins:** Desktop views require substantial outer margins (48px) to frame the "printed" content within the browser window.

## Elevation & Depth

This system is strictly **Flat**.

- **No Shadows:** Soft ambient shadows are prohibited. Depth is never simulated via light source metaphors.
- **Tonal Layering:** Depth is achieved by "stacking" bordered boxes. A foreground element (like a modal) is simply a box with a 2px black border and a solid background (White or Yellow) placed on top of the background grid.
- **Hard Offsets:** For buttons or cards that require a "raised" look, use a hard-edged 4px offset solid black fill (simulated shadow) rather than a blur.
- **Inversion:** High-z-index elements should use high-contrast color shifts (e.g., a modal header in Black with White text) to separate it from the content below.

## Shapes

The shape language is defined by the **Right Angle**.

- **Corners:** 0px radius is the default for all containers, buttons, and input fields. In specific cases where "Human Resources" needs a slightly softer touch (e.g., employee avatars), a maximum radius of 4px can be applied, but this is an exception, not the rule.
- **Borders:** A consistent 2px black stroke must be applied to all interactive and containment elements.
- **Buttons:** Rectangular blocks only. No pill shapes.

## Components

### Buttons
Primary buttons are #FFFF00 with a 2px black border and black text. On hover, the background color inverts to #000000 and the text to #FFFF00. The interaction must be instant (0ms transition) to maintain the raw feel.

### Input Fields
Inputs use a pure white background with a 2px black border. Labels are placed above the field in `label-mono` style. On focus, the border thickness increases to 3px or adds a secondary "focus ring" that is a 2px offset solid line.

### Cards & Containers
Containers are flat boxes with #F5F5F5 backgrounds. Use "header strips"—a 24px tall black bar with white text—to categorize information within a card.

### Lists & Data Tables
Tables are the core of the HR system. Use 2px black borders for the table frame and 1px lines for internal rows. Header cells must have a #000000 background with white text.

### Chips & Tags
Tags for status (e.g., "Active", "On Leave") are small rectangular boxes. Use Safety Yellow for urgent status and Electric Blue for informational status. All tags must have a 1px black border.

### Icons
Use 24px line icons with a consistent 2px stroke weight. Avoid filled icons unless used for a "toggled" state. Icons should be strictly black or white.