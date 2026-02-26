'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import type { Conference } from '@/types/conference';
import { extractDominantColor, generateSecondaryColor } from '@/lib/utils';
import { useState } from 'react';

const conferenceSchema = z.object({
  id: z
    .string()
    .min(1, 'L\'ID est requis')
    .regex(/^[a-z0-9-]+$/, 'Uniquement minuscules, chiffres et tirets'),
  title: z.string().min(1, 'Le titre est requis'),
  date: z.string().min(1, 'La date est requise'),
  description: z.string().min(1, 'La description est requise'),
  img: z.string().url('URL invalide'),
  content: z.string().min(1, 'Le contenu est requis'),
  duration: z.string().optional(),
  mainColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Format: #RRGGBB'),
  secondColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Format: #RRGGBB'),
  speakers: z.array(
    z.object({
      firstname: z.string().min(1, 'Prénom requis'),
      lastname: z.string().min(1, 'Nom requis'),
    })
  ),
  stakeholders: z.array(
    z.object({
      firstname: z.string().min(1, 'Prénom requis'),
      lastname: z.string().min(1, 'Nom requis'),
      job: z.string().optional(),
      img: z.string().url('URL invalide').optional().or(z.literal('')),
    })
  ),
  osMap: z
    .object({
      addressl1: z.string().optional(),
      addressl2: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    })
    .optional(),
});

type ConferenceFormData = z.infer<typeof conferenceSchema>;

interface ConferenceFormProps {
  conference?: Conference;
  onSubmit: (data: ConferenceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ConferenceForm({
  conference,
  onSubmit,
  isSubmitting,
}: ConferenceFormProps) {
  const router = useRouter();
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);
  
  const form = useForm<ConferenceFormData>({
    resolver: zodResolver(conferenceSchema),
    defaultValues: conference
      ? {
          id: conference.id,
          title: conference.title,
          date: conference.date.split('T')[0],
          description: conference.description,
          img: conference.img,
          content: conference.content,
          duration: conference.duration || '',
          mainColor: conference.design.mainColor,
          secondColor: conference.design.secondColor,
          speakers: conference.speakers || [],
          stakeholders: conference.stakeholders || [],
          osMap: conference.osMap || {
            addressl1: '',
            addressl2: '',
            postalCode: '',
            city: '',
          },
        }
      : {
          id: '',
          title: '',
          date: '',
          description: '',
          img: '',
          content: '',
          duration: '',
          mainColor: '#6366f1',
          secondColor: '#818cf8',
          speakers: [],
          stakeholders: [],
          osMap: {
            addressl1: '',
            addressl2: '',
            postalCode: '',
            city: '',
          },
        },
  });

  const {
    fields: speakerFields,
    append: appendSpeaker,
    remove: removeSpeaker,
  } = useFieldArray({
    control: form.control,
    name: 'speakers',
  });

  const {
    fields: stakeholderFields,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({
    control: form.control,
    name: 'stakeholders',
  });

  const handleGenerateColors = async () => {
    const imgUrl = form.getValues('img');
    if (!imgUrl) {
      return;
    }

    setIsGeneratingColors(true);
    try {
      const dominantColor = await extractDominantColor(imgUrl);
      const secondaryColor = generateSecondaryColor(dominantColor);
      
      form.setValue('mainColor', dominantColor);
      form.setValue('secondColor', secondaryColor);
    } catch (error) {
      console.error('Erreur lors de l\'extraction des couleurs:', error);
    } finally {
      setIsGeneratingColors(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID unique</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ai-summit-2026"
                    {...field}
                    disabled={!!conference}
                  />
                </FormControl>
                <FormDescription>
                  Identifiant unique (non modifiable après création)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée</FormLabel>
                <FormControl>
                  <Input placeholder="2 jours" {...field} />
                </FormControl>
                <FormDescription>Ex: 1 jour, 3 jours, etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="AI & Machine Learning Summit 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateColors}
                  disabled={isGeneratingColors || !field.value}
                >
                  {isGeneratingColors ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Wand2 className="size-4" />
                  )}
                </Button>
              </div>
              <FormDescription>
                URL complète de l'image de couverture. Cliquez sur la baguette pour générer les couleurs automatiquement.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description courte</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Découvrez les dernières avancées..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Résumé affiché sur la carte de la conférence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu détaillé</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<p>Cette conférence phare...</p>"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Contenu HTML affiché sur la page de détail
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mainColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Couleur principale</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="color" className="w-20" {...field} />
                  </FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#6366f1"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Couleur secondaire</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input type="color" className="w-20" {...field} />
                  </FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="#818cf8"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Intervenants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Intervenants</h3>
              <p className="text-sm text-muted-foreground">
                Liste des speakers de la conférence
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSpeaker({ firstname: '', lastname: '' })}
            >
              <Plus className="mr-2 size-4" />
              Ajouter
            </Button>
          </div>

          {speakerFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start p-4 border rounded-lg"
            >
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`speakers.${index}.firstname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`speakers.${index}.lastname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSpeaker(index)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Organisateurs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Organisateurs</h3>
              <p className="text-sm text-muted-foreground">
                Parties prenantes de la conférence
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendStakeholder({
                  firstname: '',
                  lastname: '',
                  job: '',
                  img: '',
                })
              }
            >
              <Plus className="mr-2 size-4" />
              Ajouter
            </Button>
          </div>

          {stakeholderFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start p-4 border rounded-lg"
            >
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`stakeholders.${index}.firstname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Marie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`stakeholders.${index}.lastname`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Martin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`stakeholders.${index}.job`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonction (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Directeur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`stakeholders.${index}.img`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStakeholder(index)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Localisation */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Localisation</h3>
            <p className="text-sm text-muted-foreground">
              Adresse et coordonnées du lieu
            </p>
          </div>

          <div className="grid gap-4 p-4 border rounded-lg">
            <FormField
              control={form.control}
              name="osMap.addressl1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse ligne 1</FormLabel>
                  <FormControl>
                    <Input placeholder="123 rue de la Tech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="osMap.addressl2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse ligne 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Bâtiment A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="osMap.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="osMap.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {conference ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
