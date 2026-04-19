import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.css'
})
export class PromptListComponent implements OnInit {
  prompts = signal<Prompt[]>([]);
  searchTerm = signal<string>('');
  filterOption = signal<string>('newest');

  // Computed signal for filtered and sorted prompts
  filteredPrompts = computed(() => {
    let list = this.prompts().filter(p => 
      p.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      p.content.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      p.tags?.some(t => t.name.toLowerCase().includes(this.searchTerm().toLowerCase()))
    );

    // Sorting logic
    const option = this.filterOption();
    if (option === 'popular') {
      return list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (option === 'complexity') {
      return list.sort((a, b) => b.complexity - a.complexity);
    } else {
      // Default: newest
      return list.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }
  });

  constructor(private promptService: PromptService) { }

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        this.prompts.set(data);
      },
      error: (err) => {
        console.error('Error fetching prompts:', err);
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm.set(event.target.value);
  }

  onFilterChange(event: any): void {
    this.filterOption.set(event.target.value);
  }
}
