# Design: Add Upload Document CTA on Dashboard

## Components

### Dashboard Header Extension

The `Dashboard` component's `header` prop currently only contains an `h2` element. I will wrap it in a `flex` container to accommodate the new button.

**Original:**
```jsx
header={
    <h2 className="font-bold text-2xl text-foreground tracking-tight">
        Welcome back, {auth.user.name.split(' ')[0]}
    </h2>
}
```

**Proposed:**
```jsx
header={
    <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl text-foreground tracking-tight">
            Welcome back, {auth.user.name.split(' ')[0]}
        </h2>
        <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href={route('documents.create')}>
                <Plus className="mr-2 h-4 w-4" />
                UPLOAD DOCUMENT
            </Link>
        </Button>
    </div>
}
```

## Styling

The button will use:
- `bg-primary` for high visibility.
- `rounded-xl` to match the dashboard's soft corner aesthetic.
- `font-bold` and uppercase text for a premium "corporate" feel.
- `shadow-lg shadow-primary/20` to give it depth.

## Icons

I will use the `Plus` icon from `lucide-react` to signify "Add/New".
