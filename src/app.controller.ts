import { Controller, Get, Render, Req } from '@nestjs/common';
import { ProjectsService } from './modules/projects/projects.service';

@Controller()
export class AppController {
  constructor(private readonly projectsService: ProjectsService) {
  }

  @Get()
  @Render('index')
  async root(@Req() req: any) {
    const allProjects = await this.projectsService.findAll();
    const featuredProjects = allProjects.slice(0, 6);

    return {
      featuredProjects,
      user: req.session?.user,
      pageTitle: 'Accueil',
    };
  }
}
