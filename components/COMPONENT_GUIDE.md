# Component Guide for Interview

## 🎯 **Key Components to Know**

### **1. Layout Components**

#### `Header.tsx`
- **Purpose**: Main navigation header
- **Key Features**: Logo, navigation menu, user actions
- **Interview Point**: Demonstrates layout component organization

#### `Sidebar.tsx`
- **Purpose**: Navigation sidebar with menu items
- **Key Features**: Collapsible menu, active state management
- **Interview Point**: Shows responsive design patterns

### **2. Inventory Components**

#### `ProductCard.tsx`
- **Purpose**: Display individual product information
- **Key Features**: 
  - Product details display
  - Action buttons (edit, delete, status update)
  - Status indicators
- **Interview Point**: Reusable component with props interface

#### `ProductForm.tsx`
- **Purpose**: Create/Edit product form
- **Key Features**:
  - Form validation with react-hook-form
  - Zod schema validation
  - tRPC mutation integration
- **Interview Point**: Form handling and API integration

#### `InventoryFilters.tsx`
- **Purpose**: Filter and search products
- **Key Features**:
  - Search functionality
  - Category/status filters
  - Real-time filtering
- **Interview Point**: State management and user interaction

### **3. Modal Components**

#### `StatusUpdateModal.tsx`
- **Purpose**: Update product status
- **Key Features**:
  - Status selection
  - User assignment (pickedBy)
  - Validation logic
- **Interview Point**: Modal patterns and form validation

#### `HistoryModal.tsx`
- **Purpose**: Display product checkout history
- **Key Features**:
  - Timeline view of status changes
  - User information display
  - Date formatting
- **Interview Point**: Data display and user experience

## 🔧 **Component Patterns**

### **1. Props Interface Pattern**
```typescript
interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string) => void;
}
```

### **2. Form Pattern**
```typescript
const form = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
  defaultValues: product || defaultValues,
});
```

### **3. Modal Pattern**
```typescript
const [isOpen, setIsOpen] = useState(false);
// Modal state management
```

## 📝 **Interview Talking Points**

### **Q: How do you organize your components?**
**A:** 
- **Feature-based organization**: Components grouped by business domain
- **Separation of concerns**: UI components vs business logic
- **Reusability**: Generic UI components in `ui/` folder
- **Maintainability**: Clear file structure and naming conventions

### **Q: How do you handle component communication?**
**A:**
- **Props drilling**: For simple parent-child communication
- **tRPC mutations**: For API calls and state updates
- **React Query**: For server state management
- **Local state**: For UI-specific state (modals, forms)

### **Q: How do you ensure component reusability?**
**A:**
- **Generic UI components**: Button, Card, Dialog, etc.
- **Props interfaces**: TypeScript for type safety
- **Composition patterns**: Flexible component composition
- **Default props**: Sensible defaults for optional props

### **Q: How do you handle form validation?**
**A:**
- **Zod schemas**: Runtime validation
- **react-hook-form**: Form state management
- **TypeScript**: Compile-time type checking
- **Error handling**: User-friendly error messages

## 🚀 **Component Best Practices**

1. **Single Responsibility**: Each component has one clear purpose
2. **Type Safety**: TypeScript interfaces for all props
3. **Error Boundaries**: Handle component errors gracefully
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: ARIA labels and keyboard navigation
6. **Testing**: Unit tests for complex logic
7. **Documentation**: JSDoc comments for public APIs

## 🎨 **UI Component Library (shadcn/ui)**

- **Why shadcn/ui**: Pre-built, accessible components
- **Customization**: Tailwind CSS for styling
- **Consistency**: Design system across the app
- **Accessibility**: Built-in ARIA support 