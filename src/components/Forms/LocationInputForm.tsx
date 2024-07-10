"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Autocomplete } from "@react-google-maps/api"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LocationProp } from "@/Props"

const FormSchema = z.object({
  location: z.string().min(1, {
    message: "Location must be at least 1 character.",
  }),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

const LocationInputForm: React.FC<{
  location: LocationProp,
  map: google.maps.Map | null,
  setLocation: React.Dispatch<React.SetStateAction<LocationProp>>,
  currLocation: LocationProp,
  marker: google.maps.Marker | null
}> = ({ map, setLocation, currLocation, marker }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
      lat: 0,
      lng: 0,
    },
  })


  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        form.setValue('location', place.formatted_address || '')
        form.setValue('lat', place.geometry.location.lat())
        form.setValue('lng', place.geometry.location.lng())
      } else {
        // Handle the case when no place details are available
        form.setValue('location', inputRef.current?.value || '')
        form.setValue('lat', 0)
        form.setValue('lng', 0)
      }
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const position: LocationProp = { lat: data.lat ?? 0, lng: data.lng ?? 0 };
    setLocation(position);
    marker?.setPosition(position);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 items-center">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormControl>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={onPlaceChanged}
                >
                  <Input
                    {...field}
                    ref={inputRef}
                    placeholder="Enter Location"
                    onChange={(e) => {
                      field.onChange(e)
                      form.setValue('lat', 0)
                      form.setValue('lng', 0)
                    }}
                  />
                </Autocomplete>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="row2 col-span-1 flex gap-2 justify-center">
          <Button type="submit" className="w-fit">Search</Button>
          <Button type="button" className="w-fit cursor-pointer" onClick={(e) => {
            e.preventDefault();
            map?.panTo(currLocation);
            setLocation({
              lat: currLocation.lat,
              lng: currLocation.lng
            })
            marker?.setPosition(currLocation);
            form.reset();
          }} >Reset</Button>
        </div>
      </form>
    </Form>
  )
}

export default LocationInputForm