import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from '../project.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  project$: Observable<Project>;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.projectService.getProject(params.get('id'));
      })
    );
  }
}
