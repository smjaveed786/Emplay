import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from .models import Prompt, Tag

@csrf_exempt
def prompt_list(request):
    if request.method == "GET":
        prompts = Prompt.objects.all().order_by('-created_at')
        data = []
        for p in prompts:
            cache_key = f"prompt:{p.id}:views"
            v_count = cache.get(cache_key) or p.view_count
            
            data.append({
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "complexity": p.complexity,
                "created_at": p.created_at,
                "view_count": v_count,
                "tags": list(p.tags.values("id", "name", "color"))
            })
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            content = data.get("content")
            complexity = data.get("complexity")
            tag_names = data.get("tags", []) # Expecting list of strings

            errors = {}
            if not title or len(title) < 3: errors["title"] = "Title too short."
            if not content or len(content) < 20: errors["content"] = "Content must be at least 20 characters."
            try:
                complexity = int(complexity)
                if not (1 <= complexity <= 10): errors["complexity"] = "Range 1-10."
            except: errors["complexity"] = "Must be integer."

            if errors: return JsonResponse({"errors": errors}, status=400)

            # Safely handle author for guest mode
            author = request.user if request.user.is_authenticated else None
            prompt = Prompt.objects.create(title=title, content=content, complexity=complexity, author=author)
            
            # Handle tags
            for name in tag_names:
                tag, _ = Tag.objects.get_or_create(name=name.strip())
                prompt.tags.add(tag)

            return JsonResponse({"id": prompt.id, "title": prompt.title}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def prompt_detail(request, pk):
    if request.method == "GET":
        try:
            prompt = Prompt.objects.get(pk=pk)
            cache_key = f"prompt:{prompt.id}:views"
            
            try:
                if cache.get(cache_key) is None:
                    cache.set(cache_key, prompt.view_count, timeout=None)
                current_views = cache.incr(cache_key)
            except Exception:
                current_views = prompt.view_count + 1
                prompt.view_count = current_views
                prompt.save()

            return JsonResponse({
                "id": prompt.id,
                "title": prompt.title,
                "content": prompt.content,
                "complexity": prompt.complexity,
                "created_at": prompt.created_at,
                "view_count": current_views,
                "author_id": prompt.author_id,
                "tags": list(prompt.tags.values("id", "name", "color"))
            })
        except Prompt.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)
            
    elif request.method == "PUT":
        try:
            prompt = Prompt.objects.get(pk=pk)
            data = json.loads(request.body)
            prompt.title = data.get("title", prompt.title)
            prompt.content = data.get("content", prompt.content)
            prompt.complexity = data.get("complexity", prompt.complexity)
            prompt.save()
            
            tag_names = data.get("tags")
            if tag_names is not None:
                prompt.tags.clear()
                for name in tag_names:
                    tag, _ = Tag.objects.get_or_create(name=name.strip())
                    prompt.tags.add(tag)
                    
            return JsonResponse({"message": "Updated successfully"})
        except Prompt.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    elif request.method == "DELETE":
        try:
            prompt = Prompt.objects.get(pk=pk)
            prompt.delete()
            return JsonResponse({"message": "Deleted successfully"})
        except Prompt.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)

def tag_list(request):
    if request.method == "GET":
        tags = list(Tag.objects.all().values("id", "name", "color"))
        return JsonResponse(tags, safe=False)
    return JsonResponse({"error": "Method not allowed"}, status=405)
