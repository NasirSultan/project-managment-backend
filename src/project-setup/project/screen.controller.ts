import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { ScreenService } from './screen.service'
import { CreateScreenDto } from './dto/createScreenDto'
import { UpdateScreenDto } from './dto/updateScreenDto'

@Controller('screens')
export class ScreenController {
  constructor(private readonly service: ScreenService) {}

@Post('batch')
createMultiple(@Body() body: { flowId: string; screens: Omit<CreateScreenDto, 'flowId'>[] }) {
  return this.service.createMultiple(body.screens, body.flowId)
}


  @Get()
  getAll() {
    return this.service.getAll()
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateScreenDto) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }

@Get('flow/:flowId')
getByFlow(@Param('flowId') flowId: string) {
  return this.service.getByFlow(flowId)
}


  @Get(':id/flows')
  getProjectWithFlows(@Param('id') id: string) {
    return this.service.getProjectWithFlows(id)
  }

  @Get('flow/:flowId/screens')
  getFlowWithScreens(@Param('flowId') flowId: string) {
    return this.service.getFlowWithScreens(flowId)
  }

}
