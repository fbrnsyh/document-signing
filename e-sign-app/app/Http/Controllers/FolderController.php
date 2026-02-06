<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Folder;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function index()
    {
        $folders = Folder::where('user_id', Auth::id())
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return response()->json($folders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'parent_id' => 'nullable|exists:folders,id',
        ]);

        if ($request->parent_id) {
            $parent = Folder::where('user_id', Auth::id())->findOrFail($request->parent_id);
            if ($parent->parent_id) {
                 return back()->withErrors(['name' => 'Only one level of nesting is allowed']);
            }
        }

        $folder = Folder::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->route('documents.index')->with('success', 'Folder created successfully');
    }

    public function update(Request $request, Folder $folder)
    {
        $this->authorize('update', $folder);

        $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $folder->update(['name' => $request->name]);

        return redirect()->route('documents.index')->with('success', 'Folder updated successfully');
    }

    public function destroy(Folder $folder)
    {
        $this->authorize('delete', $folder);

        if ($folder->documents()->count() > 0 || $folder->children()->count() > 0) {
            return back()->withErrors(['name' => 'Folder not empty']);
        }

        $folder->delete();

        return redirect()->route('documents.index')->with('success', 'Folder deleted successfully');
    }
}
