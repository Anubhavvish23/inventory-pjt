# Component Organization

## 📁 Structure Overview

```
components/
├── ui/                    # Reusable UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/               # Layout components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── client-providers.tsx
├── inventory/            # Feature-specific components
│   ├── product-card.tsx
│   ├── product-form.tsx
│   ├── inventory-filters.tsx
│   ├── status-update-modal.tsx
│   └── history-modal.tsx
└── README.md            # This file
```

## 🎯 Component Categories

### 1. **UI Components** (`ui/`)
- **Purpose**: Reusable, generic UI components
- **Source**: shadcn/ui library
- **Examples**: Button, Card, Dialog, Input, etc.
- **Usage**: Import as `@/components/ui/button`

### 2. **Layout Components** (`layout/`)
- **Purpose**: Page structure and navigation
- **Examples**: Header, Sidebar, Navigation
- **Usage**: Used in app layout and pages

### 3. **Feature Components** (`inventory/`)
- **Purpose**: Business logic specific to inventory management
- **Examples**: ProductCard, ProductForm, InventoryFilters
- **Usage**: Import as `@/components/inventory/product-card`

## 🔧 Best Practices

1. **Naming**: Use kebab-case for file names
2. **Organization**: Group by feature, not by type
3. **Reusability**: Keep UI components generic
4. **Props**: Use TypeScript interfaces for props
5. **Documentation**: Add JSDoc comments for complex components

## 📝 Interview Talking Points

- **Component Architecture**: Feature-based organization
- **Reusability**: UI components vs feature components
- **Type Safety**: TypeScript interfaces for props
- **Maintainability**: Clear separation of concerns 