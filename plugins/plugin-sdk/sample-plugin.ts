/**
 * Project: KNOUX Player X™
 * File: sample-plugin.ts
 * Purpose: Simple demonstration plugin used as a template for third‑party developers.
 * Layer: Core / Plugin SDK Example
 */

import type { KnuXContext, KnuXPluginDescriptor, PluginCommandDefinition } from './pluginTypes';

export default async (context: KnuXContext): Promise<KnuXPluginDescriptor> => {
  const plugin: KnuXPluginDescriptor = {
    name: 'sample',
    description: 'Example plugin that logs when it becomes active',
    activate: async () => {
      console.log('[Sample Plugin] Activated');
      // Example of registering a global command
      const cmd: PluginCommandDefinition = {
        command: 'sample.print',
        title: 'Print a message to console',
        handler: async () => console.log('Sample command executed')
      };
      if (context.ipc) {
        context.ipc.send('knux:plugin:registerCommand', cmd);
      }
    },
    deactivate: async () => console.log('[Sample Plugin] Deactivated')
  };
  return plugin;
};
